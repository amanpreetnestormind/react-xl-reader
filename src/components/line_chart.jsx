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
                []
            ],
            start_date: "",
            allDatesArr: [],
            end_date: "",
            highestVal: ""
        }

        this.getGraphData = this.getGraphData.bind(this)
        this.getSelectDateData = this.getSelectDateData.bind(this)
        this.generateXList = this.generateXList.bind(this)
    }

    getGraphData = () => {
        const { tableRowData } = this.props
        // const lastValues = this.state.graph_data[1].slice(-4)
        // const highest = Math.max.apply(Math, lastValues.map(function (o) { return o }))

        const graphData = tableRowData.filter((item) => (item["Insp. Date"] === this.state.start_date))
        const filterData = graphData.map((data) => ([
            parseInt(moment(data['Insp. Date']).format('YYYY')) || 0,//X -axsis
            parseFloat(data['CONC/T-,alert, mm']) || 0,// y-axsis
            parseFloat(data['MAWT/T-,anomaly, mm']) || 0,// y-axsis
            parseFloat(data['RWT,,mm']) || 0,// y-axsis
            parseFloat(data['ST CR,,mmpy']) || 0,// y-axsis
            parseFloat(data['LT CR,,mmpy']) || 0,// y-axsis
            parseFloat(data['T1,,yrs']) || 0,// y-axsis
            parseFloat(data['T2,,yrs']) || 0,// y-axsis
            parseFloat(data['T3,,yrs']) || 0,// y-axsis
            parseFloat(data['T4,,yrs']) || 0,// y-axsis
        ]))
        
        const lastYear = this.state.end_date ? this.state.end_date : this.generateXList()[this.generateXList().length - 1]
        const lastYearData = graphData.map((data) => ([
            lastYear,
            parseFloat(data['CONC/T-,alert, mm']) || 0,
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
                    ...filterData,
                    ...lastYearData
                ],
                // highestVal: highest
            }
            return newState
        })
    }

    componentDidMount() {
        this.getGraphData()
        this.generateXList()
        this.getSelectDateData()
    }

    componentDidUpdate(prevProps, prevState) {
        const { isUpdate } = this.props
        if (prevState.start_date != this.state.start_date || prevState.graph_data[1].length <= 0) {
            this.generateXList()
            this.getGraphData()
        }
    }

    generateXList = () => {
        const { highestVal } = this.state
        var min = parseInt(moment(this.state.start_date).format("YYYY"))
        var graphData = this.state.graph_data.map((item) => (item[item.length - 1]))
        var max = min + graphData[1]
        var years = []

        for (var i = min; i <= max; i++) {
            years.push(i)
        }
        this.setState({
            ...this.state,
            end_date: years[years.length - 1]
        })

        return years
    }

    getSelectDateData = () => {
        const { tableRowData } = this.props
        const allDates = tableRowData.map((row) => (moment(row['Insp. Date']).format('DD MMM YYYY'))) || []
        const filterAllDates = allDates.filter((value, index, self) => (self.indexOf(value) === index))
        this.setState({
            ...this.state, allDatesArr: filterAllDates,
            start_date: allDates[0]
        })
    }

    render() {
        // setInterval(() => {
        //     this.getGraphData()
        // }, 1000);

        const { graph_data, allDatesArr, end_date } = this.state
        const { graphHeader } = this.props

        // const getHighest = () => {
        //     const lastValues = graph_data[1].slice(-4)
        //     const highest = Math.max.apply(Math, lastValues.map(function (o) { return o }))
        //     this.setState({
        //         ...this.state,
        //         highestVal: highest
        //     })
        //     console.log(highest);
        // }

        return (<Box>
            <Box className='headerBar'>
                <Box className='headerTextContainer'>
                    <Typography className='headerText'>Remaning Wall Thickness and Corrosion Rates</Typography>
                </Box>
                <Box className='headerSelectContainer'>
                    <select className='headerSelectBox' onChange={(e) => {
                        const { value } = e.target
                        this.setState({
                            ...this.state,
                            start_date: value
                        })
                        this.getGraphData()
                    }}>
                        {allDatesArr?.map((val, index) => (<option key={index} value={val}>{val}</option>))}
                    </select>
                </Box>
            </Box>
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
                    vAxis: {
                        title: "wall Thickness (mm)",
                        format: "",
                    },
                    hAxis: {
                        minValue: parseInt(moment(this.state.start_date).format("YYYY")),
                        maxValue: end_date + 1,
                        format: "",
                    },
                    // lineWidth: 30, // sets width of line

                    colors: ["#F8D66A", "#FF0202", "#0052A6", "#1A95F3", "#00FFFF", "#F7D15A", "#F8D76D", "#FF0202", "#FF0202"],
                }}
            />
        </Box>)
    }
}
