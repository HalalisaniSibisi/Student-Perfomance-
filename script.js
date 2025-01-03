
async function fetchAndParse() {
    try {
        const response = await fetch('/dataset.csv');
        const csvText = await response.text();

        // Parse CSV manually
        const rows = csvText.trim().split('\n');
        const headers = rows[0].split(',').map(header => header.trim());
        
        const parsedData = rows.slice(1).map(row => {
            const values = row.split(',').map(value => value.trim());
            return headers.reduce((obj, header, index) => {
                // Convert to number if possible
                const value = values[index];
                obj[header] = !isNaN(value) ? Number(value) : value;
                return obj;
            }, {});
        });

                // Process data into bins for grades
                const gradeBins = {
                    '90-100': 0, '80-89': 0, '70-79': 0,
                    '60-69': 0, '50-59': 0, '<50': 0
                };

                parsedData.forEach(row => {
                    const grade = row['Grades'];
                    if (grade >= 90) gradeBins['90-100']++;
                    else if (grade >= 80) gradeBins['80-89']++;
                    else if (grade >= 70) gradeBins['70-79']++;
                    else if (grade >= 60) gradeBins['60-69']++;
                    else if (grade >= 50) gradeBins['50-59']++;
                    else gradeBins['<50']++;
                });

                const ctx1 = document.getElementById('gradeChart').getContext('2d');
                new Chart(ctx1, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(gradeBins),
                        datasets: [
                            {
                                label: 'Number of Students',
                                data: Object.values(gradeBins),
                                backgroundColor: [
                                    'rgba(75, 192, 192, 0.7)',
                                    'rgba(54, 162, 235, 0.7)',
                                    'rgba(255, 206, 86, 0.7)',
                                    'rgba(255, 159, 64, 0.7)',
                                    'rgba(255, 99, 132, 0.7)',
                                    'rgba(153, 102, 255, 0.7)'
                                ],
                                borderColor: [
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(255, 159, 64, 1)',
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(153, 102, 255, 1)'
                                ],
                                borderWidth: 1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Grade Distribution',
                                font: {
                                    size: 16,
                                    weight: 'bold'
                                },
                                padding: 20
                            },
                            legend: {
                                position: 'top'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Number of Students'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Grade Ranges'
                                }
                            }
                        }
                    }
                });

// 2. Average Grades by Attendance
const attendanceBins = { '0-50%': [], '51-75%': [], '76-100%': [] };
parsedData.forEach(row => {
    const attendance = row['Attendance'];
    const grade = row['Grades'];
    if (attendance <= 50) attendanceBins['0-50%'].push(grade);
    else if (attendance <= 75) attendanceBins['51-75%'].push(grade);
    else attendanceBins['76-100%'].push(grade);
});

const avgGradesByAttendance = {};
Object.keys(attendanceBins).forEach(bin => {
    const grades = attendanceBins[bin];
    const avg = grades.reduce((sum, g) => sum + g, 0) / grades.length || 0;
    avgGradesByAttendance[bin] = avg.toFixed(2);
});

const ctx2 = document.getElementById('attendanceChart').getContext('2d');
new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: Object.keys(avgGradesByAttendance),
        datasets: [
            {
                label: 'Average Grades',
                data: Object.values(avgGradesByAttendance),
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Average Grades by Attendance'
            }
        },
        scales: {
            y: { beginAtZero: true }
        }
    }
});



const studyCtx = document.getElementById('studyChart').getContext('2d');
new Chart(studyCtx, {
    type: 'pie',
    data: {
        labels: Object.keys(studyBins),
        datasets: [
            {
                label: 'Study Time Distribution',
                data: Object.values(studyBins),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Study Time Distribution',
                font: {
                    size: 16,
                    weight: 'bold'
                },
                padding: 20
            },
            legend: {
                position: 'top'
            }
        }
    }
});



 return parsedData;

} catch(error) {
 console.error('Error fetching or parsing dataset:', error);
}
}

// Call the function when the page loads
fetchAndParse();


