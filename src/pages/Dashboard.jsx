import { useEffect } from "react"
import { useSelector } from "react-redux"

// services
import { toyActions } from "../../store/actions/toy.actions.js"
import { showErrorMsg } from "../services/event-bus.service.js"

// cmps
import { PaiChart } from "../cmps/Charts/PaiChart.jsx"
import { AreaChart } from "../cmps/Charts/AreaChart.jsx"

export function Dashboard() {

    const chartsData = useSelector(storeState => storeState.toyModule.chartsData)

    useEffect(() => {
        loadChatData()
    }, [])

    async function loadChatData() {
        try {
            await toyActions.loadChartsData()
        } catch (err) {
            showErrorMsg('Cannot load charts data')
        }
    }


    return (
        <section className="dashboard">

            <div>
                <h3>Site visits per month</h3>
                <AreaChart />
            </div>


            <div className="charts">
                {chartsData?.brands?.length > 0 &&
                    <PaiChart labelsSata={chartsData?.brands} labelsType={'Brands'} />}
                {chartsData?.productTypes?.length > 0 &&
                    <PaiChart labelsSata={chartsData?.productTypes} labelsType={'Product Types'} />}
                {chartsData?.companies?.length > 0 &&
                    <PaiChart labelsSata={chartsData?.companies} labelsType={'Companies'} />}
            </div>


        </section>
    )
}
