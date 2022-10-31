import { Typography } from '@material-ui/core';
import { Box } from '@mui/material'
import moment from 'moment';
import React, { Component } from 'react'
import { Chart } from "react-google-charts";

export default class LineChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            graph_data: [
                ["Year", "Conc/T-alert", "MAWT/T-anomaly", "RWT", "ST", "LT", "T1", "T2", "T3", "T4"],
                [2022, 1, 2, 4, 2, 1, 5, 4, 7, 8]
            ]
        }

        this.getGraphData = this.getGraphData.bind(this)
    }

    getGraphData = () => {
        const { tableRowData } = this.props
        const graphData = tableRowData?.map((data, index) => ([
            parseInt(moment(data['Insp. Date']).format('YYYY')) || 0,
            parseInt(data['CONC/T-,alert, mm']) || 0,
            parseFloat(data['MAWT/T-,anomaly, mm']) || 0,
            parseFloat(data['RWT,,mm']) || 0,
            parseFloat(data['ST CR,,mmpy']) || 0,
            parseFloat(data['LT CR,,mmpy']) || 0,
            parseFloat(data['T1,,yrs']) || 0,
            parseFloat(data['T2,,yrs']) || 0,
            parseFloat(data['T3,,yrs']) || 0,
            parseFloat(data['T4,,yrs']) || 0,
        ]))

        this.setState(previousState => {
            const newState = {
                ...previousState,
                graph_data: [
                    ["Year", "Conc/T-alert", "MAWT/T-anomaly", "RWT", "ST", "LT", "T1", "T2", "T3", "T4"],
                    ...graphData
                ]
            }
            return newState
        })
    }

    componentDidMount() {
        this.getGraphData()
    }

    componentDidUpdate(prevProps, prevState) {
        const { isUpdate, setIsUpdate } = this.props
        if (prevState.data !== this.state.data) {
            this.getGraphData()
        }
        // if (isUpdate) {
        //     this.getGraphData()
        //     // setIsUpdate({ ...isUpdate, isUpdate: false })
        // }
    }


    render() {
        setInterval(() => {
            this.getGraphData()
        }, 1000);

        const { graph_data } = this.state
        const { graphHeader } = this.props

        return (<Box>
            <Typography style={{
                fontSize: "11px"
            }}>{graphHeader[0]['No.']}</Typography>
            <Chart
                chartType="LineChart"
                data={graph_data}
                width="100%"
                height="400px"
                legendToggle
                loader={<div>Loading...</div>}
                options={{
                    legend: "top",
                    // colors:["yellow","red","lightblue","green","brown","grey","orange","purple"],
                    // backgroundColor:"#9A0000"
                    is3D: true,
                }}
            />
        </Box>)
    }
}
