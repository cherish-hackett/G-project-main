<template>
    <div class="q-pa-md" style="margin-top: 15%;">
        <div class="column">
            <div class="col self-center">
                <canvas ref="pieChart"></canvas>
            </div>
            <div class="col self-center q-mt-md">
                <template v-for="(data, index) in buttonData" :key="index">
                    <q-btn push unelevated color="primary" class="q-mt-sm full-width" @click="listFun(data)">
                        <template v-slot:default>
                            <q-badge color="orange" floating>{{ data.count }}</q-badge>
                            <q-item-label class="q-pa-sm">{{ data.label }}</q-item-label>
                        </template>
                    </q-btn>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

Chart.register(PieController, ArcElement, Tooltip, Legend);

export default {
    name: 'PieChart',
    props: {
        chartData: {
            type: Object,
            required: true
        },
        buttonData: Array
    },
    setup(props) {
        const router =  useRouter();
        const pieChart = ref(null);
        let chartInstance = null;
        console.log("gfgf");
        const renderChart = () => {
   
            if (chartInstance) {
                chartInstance.destroy();
            }
            const ctx = pieChart.value.getContext('2d');
            chartInstance = new Chart(ctx, {
                type: 'pie',
                data: props.chartData,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        datalabels: {
                            color: '#fff',
                            anchor: 'center',
                            align: 'center',
                            formatter: (value) => value
                        }
                    },
                    onClick(event, elements) {
                        if (elements.length > 0) {
                            const clickedIndex = elements[0].index;
                            handleChartClick(clickedIndex);
                        }
                    }
                }
            });
        };

        const handleChartClick = (index) => {
            const label = props.chartData.labels[index].toLowerCase();
            // Example routing logic:
            // this.$router.push({ name: `${label}Component` });
        };

        onMounted(() => {
            renderChart();
        });

        watch(() => props.chartData, () => {
            renderChart();
        });

        return {
            pieChart,
            renderChart,
            handleChartClick,
            router
        };
    },
    methods:{
        listFun(data){
            console.log(data);
            this.router.push({name:data.path,params:{ type : data.type}})
        }
    }
};
</script>

<style>
canvas {
    max-width: 85vw;
    max-height: 40vh;
}
</style>