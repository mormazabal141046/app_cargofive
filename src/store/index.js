import Vue from 'vue'
import Vuex from 'vuex'

const Axios = require('axios');
const axios = Axios.create({
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
});


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ports:[],
    pagination: {},
    total_pages: null
  },
  mutations: {
    // Setea las variables 
    setDataPorts(state, data){
      state.ports = data.data;
      state.pagination['meta'] = data.meta;
      state.total_pages = data.meta.last_page;
    }
  },
  actions: {
    // Obtiene la data inicial de los puertos
    getPorts({commit}){
      let url = "https://apitest.cargofive.com/api/ports";
      axios.get(url).then( response => {
        let data = response.data;
        if(response.status == 200){
          commit('setDataPorts', data);
        }else{
          console.log("Lo siento. No hemos podido procesar la data requerida.")
        }
      }).catch( error => {
        console.log("Error al cargar los Puertos", error)
      })

    },
    // Obtiene la data de los puertos por pagina
    getDataByPage({commit}, page){
      let url = 'https://apitest.cargofive.com/api/ports?page='+page;
      axios.get(url).then( response => {
        let data = response.data;
        if(response.status == 200){
          commit('setDataPorts', data);
        }else{
          console.log("Lo siento. No hemos podido procesar la data requerida.")
        }
      }).catch( error => {
        console.log("Error al obtener la página", error)
      })
  }
  },
  modules: {
  }
})
