<template>
  <div class="container">
   <label for="Metrica">Elige una metrica: </label>
   <select class="select" id="metrica">
     <option value="1" selected>Correlacion de Pearson</option>
     <option value="2">Distancia coseno</option>
     <option value="3">Distancia Euclidea</option>
    </select>
   <hr class="separator">
   <label for="Vecinos">Elige el numero de vecinos: </label>
   <select class="select" id="vecinos">
     <option value="1" selected>1</option>
     <option value="2">2</option>
     <option value="3">3</option>
     <option value="4">4</option>
    </select>
   <hr class="separator">
   <label for="Prediccion">Elige una prediccion: </label>
   <select class="select" id="prediccion">
     <option value="1" selected>Predicción simple</option>
     <option value="2">Diferencia con la media</option>
    </select>
    <br>
    <br>
    <div>
      <label for="input-file">Introduce un archivo:</label><br>
      <input type="file" id="input-file">
    </div>
    <button class="button" v-on:click="getData">Calcular</button>
    <div class="solucion" id="solucion"></div>
  </div>
</template>

<script>
export default {
  name: 'Content',
  data() {
    return {
      datos: [],        // Metrica, numero de vecinos y prediccion elegida por el usuario se guardan aqui (getData). 
      Matriz: [],       // Matriz de calificaciones
      metrica: [],      // Metricas calculadas
      incognita: [],    // Posicion de donde se encuentra la incognita
      pred: Number      // Resultado de la prediccion
    }
  },
  methods: {
    getData() {
      this.datos = []
      const metrica = document.getElementById("metrica").value  // Metrica elegida
      this.datos.push(metrica)
      const vecino = document.getElementById("vecinos").value  // Numero de vecinos elegidos
      this.datos.push(vecino)
      const prediccion = document.getElementById("prediccion").value  // Prediccion elegida
      this.datos.push(prediccion)
      const file = document.getElementById("input-file").files[0];  // Leemos el contenido del fichero y rellenamos la matriz
      this.readFileContent(file).then(result => {
        const stringArray = result.split("\n")
        stringArray.forEach((element, index) => {
          this.Matriz[index] = [];
          let charArray = element.split(" ");
          charArray.forEach((element, index2) => {
            if(!isNaN(element)){
              this.Matriz[index][index2] = parseInt(element)
            }
            else {
              this.Matriz[index][index2] = '*'
              this.incognita.push(index);
              this.incognita.push(index2);
            }
          });
        })
        this.calcularMetricas();  // Llamamos a la funcion que calcula las metricas
        this.calcularPrediccion(); // Llamamos a la funcion que calcula la prediccion
      });
    },
    readFileContent(file) {
      const reader = new FileReader()
      return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(file, "UTF-8")
      })
    },
    calcularMetricas() {
      this.metrica = []
      for (let i = 0; i < this.Matriz.length; i++) { // Calculamos la metrica del usuario con todos sus vecinos
        if (i != this.incognita[0]) {
          switch (this.datos[0]) {
            case "1": 
              this.metrica.push(this.Pearson(this.Matriz[this.incognita[0]], this.Matriz[i])) // Mandamos el vector del usuario y el del vecino por cada vecino que haya
            break;
            case "2": 
              this.metrica.push(this.Coseno(this.Matriz[this.incognita[0]], this.Matriz[i]))
            break;
            case "3": 
              this.metrica.push(this.Euclidea(this.Matriz[this.incognita[0]], this.Matriz[i]))
            break;
          }
        } else {
          this.metrica.push(0);
        }
      }
    },
    calcularPrediccion() {
      let newM = []
      let indexes = []
      this.metrica.forEach(element => {
        newM.push(element)
      })
      newM[this.incognita[0]] = -Infinity
      for (let i = 0; i < this.datos[1]; i++) { // Creamos un vector que tendra los indices de los vecinos con mas correlacion ordenados.
        const max = Math.max(...newM)
        const index = newM.indexOf(max);
        indexes.push(index)
        newM[index] = -Infinity
      }
      switch (this.datos[2]) {  // Elegimos la prediccion
        case "1": 
          console.log("Prediccion Simple");
          this.pred = this.PrediccionSimple(indexes);
          this.Resultado(indexes)  // Llamamos a la funcion que imprime el resultado en el html
        break;
        case "2": 
          console.log("Prediccion Media")
          this.pred = this.PrediccionMedia(indexes);
          this.Resultado(indexes)
        break;
      }
    },
    Pearson(a_, b_) {
      let a = []
      let b = []
      a_.forEach((element, index) => {
        if (this.incognita[1] !== index) {
          a.push(element);
          b.push(b_[index])
        }
      })
      let media_a = 0;
      let media_b = 0;
      a.forEach((element) => {
        media_a += element;
      })
      media_a = media_a/a.length;
      b.forEach((element) => {
        media_b += element;
      })
      media_b = media_b/b.length;
      let num = 0;
      for (let i = 0; i < a.length; i++) {
        num += (a[i] - media_a) * (b[i] - media_b);
      }
      let den1 = 0;
      let den2 = 0;
      for (let i = 0; i < a.length; i++) {
        den1 += Math.pow((a[i] - media_a), 2);
        den2 += Math.pow((b[i] - media_b), 2);
      }
      let den = Math.sqrt(den1) * Math.sqrt(den2)
      return num / den;
    },
    Coseno(a_, b_) {
      let a = []
      let b = []
      a_.forEach((element, index) => {
        if (this.incognita[1] !== index) {
          a.push(element);
          b.push(b_[index])
        }
      })
      let num = 0;
      for (let i = 0; i < a.length; i++) {
        num += (a[i]) * (b[i]);
      }
      let den1 = 0;
      let den2 = 0;
      for (let i = 0; i < a.length; i++) {
        den1 += Math.pow((a[i]), 2);
        den2 += Math.pow((b[i]), 2);
      }
      let den = Math.sqrt(den1) * Math.sqrt(den2)
      return num / den;
    }, 
    Euclidea(a_, b_) {
      let a = []
      let b = []
      a_.forEach((element, index) => {
        if (this.incognita[1] !== index) {
          a.push(element);
          b.push(b_[index])
        }
      })
      let result = 0;
      for (let i = 0; i < a.length; i++) {
        result += Math.pow((a[i] - b[i]), 2);
      }
      return Math.sqrt(result);
    },
    PrediccionSimple(Indexes) {
      let num = 0;
      let den = 0;
      for (let i = 0; i < Indexes.length; i++) {
        num += this.metrica[Indexes[i]] * this.Matriz[Indexes[i]][this.incognita[1]]
        den += Math.abs(this.metrica[Indexes[i]])
      }
      return Math.round((num/den)*100)/100
    },
    PrediccionMedia(Indexes) {
      let num = 0;
      let den = 0;
      let mediaU = []
      this.Matriz[this.incognita[0]].forEach(element=> {
        if (element != "*") mediaU.push(element);
      })
      mediaU = mediaU.reduce((value1, value2) => value1 + value2, 0)/mediaU.length;
      for (let i = 0; i < Indexes.length; i++) {
        let mediaV = this.Matriz[Indexes[i]].reduce((value1, value2) => value1 + value2, 0)/this.Matriz[Indexes[i]].length
        num += this.metrica[Indexes[i]] * (this.Matriz[Indexes[i]][this.incognita[1]] - mediaV)
        den += Math.abs(this.metrica[Indexes[i]])
      }
      return Math.round(((num/den) + mediaU)*100)/100
    },
    Resultado(Indexes) {
      document.getElementById("solucion").innerHTML = '';
      const page = document.getElementById("solucion");
      const table = document.createElement("table");
      let tr = document.createElement("tr")
      for (let i = 0; i <= this.Matriz[0].length; i++) {
        let td = document.createElement("td")
        let b = document.createElement("b")
        if (i === 0) { b.innerHTML = "          "
        } else { b.innerHTML = "Item" + i
        }
        td.appendChild(b)
        tr.appendChild(td)
      }
      table.appendChild(tr)
      this.Matriz.forEach((element, index) => {
        let tr = document.createElement("tr")
        let td = document.createElement("td")
        let b = document.createElement("b")
        b.innerHTML = "Persona" + (index + 1)
        td.appendChild(b)
        tr.appendChild(td)
        element.forEach(element2 => {
          let td = document.createElement("td")
          let span = document.createElement("span")
          if(element2 != '*') {
            span.innerHTML = element2
          }
          else {
            span.innerHTML = this.pred
            span.className = "NewValue"
          }
          td.appendChild(span)
          tr.appendChild(td)
        });
        table.appendChild(tr)
      });
      page.appendChild(table)
      let div = document.createElement("div")
      div.className = "displayColumn"
      let span = document.createElement("span")
      span.innerHTML = "Resultado de la Metrica"
      span.style = "font-weight: bold"
      div.appendChild(span)
      this.metrica.forEach((element, index) => {
        if (index != this.incognita[0]) {
          let span = document.createElement("span")
          span.innerHTML = element;
          if (Indexes.includes(index)) {
            span.className = "NewValue"
          }
          div.appendChild(span)
        }
        else {
          let span = document.createElement("span")
          span.innerHTML = " "
          span.style="height: 26px;"
          div.appendChild(span)
        }
      });
      page.appendChild(div)
    }
  }
}
</script>

<style>
  .container {
    margin-top: 30px !important;
    width: 90%;
    margin: auto;
  }
  .separator {
    width: 350px;
    border: 1px solid rgb(110, 108, 109);
  }
  .button {
    margin-top: 40px;
    height: 30px;
    background-color: rgb(30, 157, 241);
    border-radius: 10px;
    color: white;
  }
  .select {
    height: 30px;
    background-color: rgb(30, 62, 241);
    border-radius: 10px;
    color: white;
  }
  .inputs {
    margin-top: 50px;
    height: 40px;
  }
  .solucion {
    display: flex;
    justify-content: center;
    margin-top: 50px;
    font-size: 22px;
  }
  .NewValue {
    color: blue;
    font-weight: bold;
  }
  td {
    text-align: center;
  }
  .displayColumn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 50px;
  }
  .displayColumn span {
    margin: 6px;
  }
</style>