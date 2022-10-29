import React, { Component } from 'react'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box } from '@material-ui/core';
import { Button, Table } from 'react-bootstrap';
import { AiOutlineCloudUpload, AiOutlineCloudDownload } from 'react-icons/ai'
import moment from 'moment';
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
const fileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

export default class TableData extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rowsModeModal: {}
    }
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

  render() {

    const { handleFileUpload, tableData, columns, tableState, setTableState } = this.props

    return (
      <Box>
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
                onChange={handleFileUpload}
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
          height: 300,
          width: '100%',
        }}>
          <DataGrid
            rows={tableData}
            rowSpacingType="margin"
            classes={{
              columnHeader: "custom-header"
            }}
            columns={columns?.map((col) => ({
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
            }))}
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
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection={false}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
            rowModesModel={this.state.rowsModeModal}
            onRowModesModelChange={(newModel) => {
              this.setState({
                ...this.state,
                rowsModeModal: newModel
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
              setTableState({
                ...tableState,
                data: tableData.map((row) => (row.id === newRow.id ? updatedRow : row))
              })
              return tableState
            }}
            onProcessRowUpdateError={(_) => { console.log(_, 'onProcessRowUpdateError'); }}

            // style={{
            //   height: "450px"
            // }}
            // loading={tableData.length === 0}
            autoHeight
          />
        </Box>
      </Box>
    )
  }
}
