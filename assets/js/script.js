const apiURL = "https://mindicador.cl/api"


async function converterMoneda() {


    const cantidadInput = document.getElementById("cantidad").value;
    const monedaSeleccionada = document.getElementById("conversor").value;
    const resultado = document.getElementById("resultado");

    try {

        const res = await fetch(apiURL)
        const data = await res.json()
        console.log(data)

        if (!cantidadInput || cantidadInput <= 0) {
            alert("Por favor ingresa un valor válido");
        }
        

        if (!data.dolar || !data.euro) {
            throw new Error("No hay datos disponibles")
        }

        const monedaDolar = data.dolar.valor;
        const monedaEuro = data.euro.valor;

        let conversion;
        if (monedaSeleccionada === "USD") {
            conversion = (cantidadInput / monedaDolar).toFixed(2);
            resultado.textContent = ` Resultado: $${conversion}`;
        } else if (monedaSeleccionada === "EUR") {
            conversion = (cantidadInput / monedaEuro).toFixed(2);
            resultado.textContent = ` Resultado: $${conversion}`
        }

        renderGrafica(monedaSeleccionada);
        


    } catch (e) {
        const errorSpan = document.getElementById("errorSpan");
        errorSpan.innerHTML = `Error ! Error: ${e.message}`;
    }
}

//Grafico

async function getAndCreateData (moneda) {
    const url = moneda === "USD" ? `${apiURL}/dolar` : `${apiURL}/euro`;
    const res = await fetch(url);
    const data = await res.json();

    const filter10 = data.serie.slice(0,10).reverse();

    const labels = filter10.map(item =>{
        const fecha = new Date(item.fecha)
        return fecha.toLocaleDateString()
    })

    const valores = filter10.map(item => item.valor);

    return {
        labels,
        datasets: [{
            label: `Valor del ${moneda === "USD" ? "Dólar" : "Euro"}`,
            borderColor: moneda === "USD" ? "rgb(255, 99, 132)" : "rgb(54, 162, 235)",
            data: valores,
            fill: false
        }]
    };
}

let chart; 
async function renderGrafica(moneda = "USD") {
    const data = await getAndCreateData(moneda);
    const config = {
        type: "line",
        data
    };

    if (chart) {
        chart.destroy(); 
    }

    const myChart = document.getElementById("myChart");
    chart = new Chart(myChart, config);
    
}



