import React, { Component } from 'react'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box } from '@material-ui/core';
import { Button, Table } from 'react-bootstrap';
import { AiOutlineCloudUpload, AiOutlineCloudDownload } from 'react-icons/ai'
import moment from 'moment';
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import LineChart from './line_chart';
const fileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

export default class TableData extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [],
      data: [],
      tableRows: [],
      rowModesModel: {},
      isUpdate: false
    }
    this.handleFileUpload = this.handleFileUpload.bind(this)
    this.processData = this.processData.bind(this)
  }

  // exportToExcel = () => {
  //   // const local = JSON.parse(localStorage.getItem("admin_coupon"))
  //   let xls = tableData?.data?.map(row => {
  //     return {
  //       "Firstname": row.firstName,
  //       "Lastname": row.lastName,
  //       "Middlename": row.middelName,
  //       "Email": row.email,
  //       "DOB": moment(row.dateOfBirth).format("DD-MM-YYYY"),
  //       "Phonenumber": row.phoneNumber
  //     };
  //   });
  //   const ws = XLSX.utils.json_to_sheet(xls);
  //   const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  //   const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  //   const data = new Blob([excelBuffer], { type: fileType });
  //   FileSaver.saveAs(data, "User's List" + fileExtension);
  // };

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

    const { columns, data, rowModesModel, tableRows } = this.state
    const graphHeader = data.slice(0, 2)
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

    console.log(this.state, "state");
    return (
      <Box>
        {data.length > 0 && <LineChart
          data={data}
          columns={columns}
          tableRowData={tableRowData}
          graphHeader={graphHeader}
          tableColumData={tableColumData}
          isUpdate={this.state}
          setIsUpdate={this.setState}
        />}
        <Box className='justify-content-between d-flex w-100'>
          <Box>
            <h3 className=''>History</h3>
          </Box>
          <Box className='d-flex gap-2'>
            <Box className="buttonContainer">
              <Button as='button' className='btn-sm btn-success' >
                <AiOutlineCloudUpload style={{ marginRight: "5px", }} />
                Import</Button>
              <input
                type="file"
                className="uploadButton"
                multiple
                accept=".xlsx,.xls,.csv"
                onChange={this.handleFileUpload}
              />
            </Box>
            {/* <Box className="buttonContainer">
              <Button as='button' className='btn-sm btn-primary' >
                <AiOutlineCloudDownload style={{ marginRight: "5px", }} />
                Export</Button>
              {/* <input
                type="file"
                className="uploadButton"
                multiple
                accept=".pdf"
                onChange={(e) => {

                }}
              /> 
            </Box> */}
          </Box>
        </Box>

        <Box sx={{
          // height: 300,
          width: '100%',
        }}>
          <DataGrid
            rows={tableRowData}
            rowSpacingType="margin"
            classes={{ columnHeader: "custom-header" }}
            columns={tableColumData}
            getCellClassName={(params) => {
              if (
                params.field === "No." ||
                params.field === "Insp. Date" ||
                params.field === "Measurement Status" ||
                params.field === "LT CR,,mmpy" ||
                params.field === "ST CR,,mmpy" ||
                params.field === "NWT,,mm" ||
                params.field === "CONC/T-,alert, mm" ||
                params.field === "MAWT/T-,anomaly, mm" ||
                params.field === "Report" ||
                params.field === "Taken By" ||
                params.field === "Probe/Isotope" ||
                params.field === "Inspection Technique" ||
                params.field === "Comments" ||
                params.value == null) {
                return '';
              }
              if (params.field === "RWT,,mm") {
                if (params.value < 5) {
                  return 'RWT-lesser'
                }
              }
              return params.value < 0 ? 'less-then-zero' : 'cold';
            }}
            getRowId={(row) => (row.id)}
            pageSize={11}
            rowsPerPageOptions={[5]}
            checkboxSelection={false}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
            rowModesModel={this.state.rowModesModel}
            onRowModesModelChange={(newModel) => {
              this.setState({
                ...this.state,
                rowModesModel: newModel
              })
            }}
            onRowEditStart={(params, event) => {
              event.defaultMuiPrevented = true;
            }}
            onRowEditStop={(params, event) => {
              event.defaultMuiPrevented = true;
            }}
            processRowUpdate={(newRow) => {
              const updatedRow = { ...newRow, isNew: false };
              this.setState((oldState) => {
                const updatedNewRows = tableRowData.map((row) => (row.id === newRow.id ? updatedRow : row))
                return {
                  ...this.state,
                  data: [...graphHeader, ...updatedNewRows],
                  tableRows: [...updatedNewRows],
                  isUpdate: true
                }
              })
              return updatedRow
            }}
            onProcessRowUpdateError={(_) => { console.log(_, 'onProcessRowUpdateError'); }}
            // loading={tableRowData.length === 0}
            autoHeight
          />
        </Box>
      </Box>
    )
  }
}
