import '../css/style.css';
import { ContentBase } from '../components/ContentBase';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, ResponsiveContainer } from "recharts";
import { Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';



import OperationService from '../services/OperationService';
import { render } from '@testing-library/react';

export function Dashboard() {

    const datateste = [
        {
            name: "Page F",
            uv: 2390,
            pv: 3800,
            amt: 2500
        },
        {
            name: "Page G",
            uv: 3490,
            pv: 4300,
            amt: 2100
        }]

    return (
        <>
            <ContentBase />
            <div className='container'>
                <h1>Dashboard</h1>
                <div className='py-5 '>
                    <ResponsiveContainer width="100%" height="100%" >
                        <OperationsByMonth></OperationsByMonth>
                    </ResponsiveContainer>

                </div>
            </div>
        </>
    );
}

function OperationsByMonth() {

    const [data, setData] = useState({ month: '', number_operation_per_month: 0, number_finished_operations_per_month: 0 });

    const operationService = new OperationService();

    useEffect(() => {
        async function fetchData() {
            try {
                const op = await operationService.getOperations();
                const operations = op.data;

                const operationsByMonth = {};

                operations.forEach(operation => {
                    const plannedDate = new Date(operation.operation_planned_date);
                    if (!isNaN(plannedDate.getTime())) {
                        const key = `${plannedDate.getFullYear()}-${(plannedDate.getMonth() + 1).toString().padStart(2, '0')}`;

                        if (!operationsByMonth[key]) {
                            operationsByMonth[key] = {
                                opened: 0,
                                finished: 0,
                            };
                        }

                        if (operation.status === 'OPENED') {
                            operationsByMonth[key].opened++;
                        } else if (operation.status !== 'CANCELLED') {
                            operationsByMonth[key].finished++;
                        }
                    }
                });

                const operationsForChart = Object.keys(operationsByMonth).map(key => ({
                    month: key,
                    number_operation_per_month: (operationsByMonth[key].opened || 0) + (operationsByMonth[key].finished || 0),
                    number_finished_operations_per_month: operationsByMonth[key].finished || 0,
                }));

                setData(operationsForChart);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []); // Empty dependency array means this effect runs only once on component mount


    return (<div>

        <h2 className='py-2'>Operations by Month</h2>

        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={data}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="number_operation_per_month" fill="#007bff" />
                <Bar dataKey="number_finished_operations_per_month" fill="#2e5575" />
            </BarChart>
        </ResponsiveContainer>
    </div>);

}


