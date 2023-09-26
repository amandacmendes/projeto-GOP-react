import '../css/style.css';
import { ContentBase } from '../components/ContentBase';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, ResponsiveContainer } from "recharts";
import { Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';



import OperationService from '../services/OperationService';
import { render } from '@testing-library/react';
import OperationStatusCards from '../components/OperationStatusCards';

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
                        <Charts></Charts>
                    </ResponsiveContainer>

                </div>
            </div>
        </>
    );
}

function Charts() {

    const [data, setData] = useState({ month: '', number_operation_per_month: 0, number_finished_operations_per_month: 0 });

    const [fetchedOperations, setFetchedOperations] = useState([]);

    const operationService = new OperationService();

    useEffect(() => {
        async function fetchData() {
            try {
                const op = await operationService.getOperations();
                const operations = op.data;
                setFetchedOperations(op.data)

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
                            operationsByMonth[key].opened--;
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
    }, []);


    return (<div>

        <div className='pb-4 '>
            <div className='pb-3 text-center'>
                <h2>Status das Operações </h2>
            </div>
            <div>
                <OperationStatusCards operations={fetchedOperations} />
            </div>
        </div>
        <hr />
        <div className='py-2 text-center'>
            <h2>Produtividade Mensal </h2>
            <h4 >Operações Abertas e Finalizadas por Mês</h4>
        </div>

        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="number_operation_per_month" name='Operações Abertas' fill="#007bff" />
                <Bar dataKey="number_finished_operations_per_month" name='Operações Finalizadas' fill="#2e5575" />
            </BarChart>
        </ResponsiveContainer>
    </div>);
}



