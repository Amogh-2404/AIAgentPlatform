import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement);

const Container = styled.div`
  padding: 20px;
  margin-left: 260px;
`;

function TaskProgress() {
  const { taskId } = useParams();
  const [taskStatus, setTaskStatus] = useState("PENDING");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      api.get(`/agents/task_status/?task_id=${taskId}`)
        .then(response => {
          setTaskStatus(response.data.state);
          if (response.data.state !== "PENDING") {
            setResult(response.data.result);
            clearInterval(interval);
          }
        })
        .catch(error => {
          console.error("Error polling task status:", error);
          clearInterval(interval);
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [taskId]);

  const data = {
    labels: ["Pending", "Completed"],
    datasets: [
      {
        label: "Task Progress",
        data: [taskStatus === "PENDING" ? 1 : 0, taskStatus === "PENDING" ? 0 : 1],
      }
    ]
  };

  return (
    <Container>
      <h2>Task Progress</h2>
      <p>Task ID: {taskId}</p>
      <p>Status: {taskStatus}</p>
      {result && <p>Result: {result}</p>}
      <Bar data={data} />
    </Container>
  );
}

export default TaskProgress;
