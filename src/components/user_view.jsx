import { Box, Tab } from '@mui/material'
import React, { Component } from 'react'
import TableData from './table_data'
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import LineChart from './line_chart';
import moment from 'moment';
const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

export default class UserViewForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            columns: [],
            data: []
        }
        this.handleFileUpload = this.handleFileUpload.bind(this)
        this.processData = this.processData.bind(this)
    }

    processData = (dataString) => {

        const dataStringLines = dataString.split(/\r\n|\n/);
        const headerString = dataStringLines.splice(4, 11).join()
        const headerArr = headerString.split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
        // const headers = dataStringLines[4].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
        // console.log(headers, "headers");
        const list = [];
        for (let i = 1; i < dataStringLines.length; i++) {
            const row = dataStringLines[i].split(
                /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
            );
            if (headerArr && row.length == headerArr.length) {
                const obj = {};
                for (let j = 0; j < headerArr.length; j++) {
                    let d = row[j];
                    if (d.length > 0) {
                        if (d[0] == '"') d = d.substring(1, d.length - 1);
                        if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
                    }
                    if (headerArr[j]) {
                        obj[headerArr[j]] = d;
                    }
                }

                // remove the blank rows
                if (Object.values(obj).filter((x) => x).length > 0) {
                    list.push(obj);
                }
            }
        }

        // prepare columns list from headerArr
        const columns = headerArr.map((c) => ({
            name: c.replace(/["\""]/g, ""),
            selector: c.replace(/["\""]/g, ""),
        }));

        this.setState({ ...this.state, columns, data: list })
    };

    handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
            /* Parse data */
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
            this.processData(data);
        };
        reader.readAsBinaryString(file);
    };

    render() {
        const { data, columns } = this.state
        const alltableArr = [...data]
        const graphHeader = data.splice(0, 2)

        const tableData = data?.map((col, index) => {
            let obj = {}
            for (let item in col) {
                obj[item.replace(/['"]+/g, '')] = col[item]
            }

            return {
                ...obj,
                id: parseInt(obj['No.']),
                'Insp. Date': moment(col['Insp. Date']).format('DD MMM YYYY'),
                'T1,,yrs': obj['T1,,yrs'].split(" ").pop(),
                'T2,,yrs': obj['T2,,yrs'].split(" ").pop(),
                'T3,,yrs': obj['T3,,yrs'].split(" ").pop(),
                'T4,,yrs': obj['T4,,yrs'].split(" ").pop()
            }
        })
        return (
            <Box className='border p-2'>
                {data.length > 0 && <LineChart
                    data={data}
                    columns={columns}
                    alltableArr={alltableArr}
                    tableData={tableData}
                    graphHeader={graphHeader}
                />}
                <TableData
                    handleFileUpload={this.handleFileUpload}
                    tableData={tableData}
                    setTableState={this.setState}
                    tableState={this.state}
                    columns={columns}
                />
            </Box>
        )
    }
}
