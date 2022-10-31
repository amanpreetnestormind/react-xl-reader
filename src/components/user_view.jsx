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
            data: [],
            tableRows: []
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
        const dataLength = list.length
        this.setState({ ...this.state, columns, data: list, tableRows: list.slice(2, dataLength) })
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
        const { data, columns,tableRows } = this.state
        const alltableArr = [...data]
        const graphHeader = data.splice(0, 2)
        
        const tableRowData = tableRows?.map((col, index) => {
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

        const tableColumData = columns?.map((col) => ({
            field: col.name,
            valueFormatter: ({ value }) => `${value}`,
            headerName: col.name.replace(",,", ","),
            minWidth:
                col.name.replace(",,", ",") === 'Comments' ? 600 :
                    col.name.replace(",,", ",") === 'No.' ? 30 :
                        col.name.replace(",,", ",") === 'Measurement Status' ? 150 : 120,
            maxWidth:
                col.name.replace(",,", ",") === 'Comments' ? 800 :
                    col.name.replace(",,", ",") === 'No.' ? 40 :
                        col.name.replace(",,", ",") === 'Measurement Status' ? 150 : 250,
            editable: col.name.replace(",,", ",") === 'No.' ? false : true,
            type: col.name.replace(",,", ",") === 'Insp. Date' ? 'date' :
                col.name.replace(",,", ",") === 'Measurement Status' ? 'boolean' :
                    col.name.replace(",,", ",") === 'LT CR,,mmpy' ? 'number' :
                        col.name.replace(",,", ",") === 'ST CR,,mmpy' ? 'number' :
                            col.name.replace(",,", ",") === 'NWT,,mm' ? 'number' :
                                col.name.replace(",,", ",") === 'CONC/T-,alert, mm' ? 'number' :
                                    col.name.replace(",,", ",") === 'MAWT/T-,anomaly, mm' ? 'number' :
                                        col.name.replace(",,", ",") === 'T1,,yrs' ? 'number' :
                                            col.name.replace(",,", ",") === 'T2,,yrs' ? 'number' :
                                                col.name.replace(",,", ",") === 'T3,,yrs' ? 'number' :
                                                    col.name.replace(",,", ",") === 'T4,,yrs' ? 'number' :
                                                        col.name.replace(",,", ",") === 'RWT,,mm' ? 'number' : "string"
        }))

        return (
            <Box className='border p-2'>
                {data.length > 0 && <LineChart
                    data={data}
                    columns={columns}
                    alltableArr={alltableArr}
                    tableRowData={tableRowData}
                    graphHeader={graphHeader}
                    tableColumData={tableColumData}
                />}
                <TableData
                    handleFileUpload={this.handleFileUpload}
                    tableRowData={tableRowData}
                    setTableState={this.setState}
                    tableState={this.state}
                    tableColumData={tableColumData}
                    alltableArr={alltableArr}
                />
            </Box>
        )
    }
}
