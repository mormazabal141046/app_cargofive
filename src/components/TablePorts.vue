<template>
  <v-card class="pb-8">
    <v-card-title> Puertos
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="ports" :search="search" :options="options" :footer-props="{'items-per-page-options': [10,25, 50, 75, -1] }">
        <template v-slot:item.from="{ item, index }">
           {{pagination.meta.from + index}}
        </template>
        <template v-slot:item.coordinates="{ item }">
            <v-btn title="Ver Mapa" color="red" plain dark @click="showMap((item.coordinates == null) ? false : item)"><v-icon>mdi-map-marker-radius</v-icon></v-btn>
        </template>
    </v-data-table>
    <v-pagination v-model="page" :length="total_pages" :total-visible="7" @input="getDataByPage"></v-pagination>

    <!-- Modal para Renderizar Ubicación del Puerto -->
    <v-dialog v-model="map" persistent>
        <v-card>
            <v-card-title class="text-h5">
                {{active_port.name}}
            </v-card-title>
            <v-card-text>
                {{ active_port.country }}
            </v-card-text>
            <v-sheet v-if="!render_map && active_port != false" :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`" class="pa-3">
                <v-skeleton-loader class="mx-auto" type="image"></v-skeleton-loader>
            </v-sheet>
            <div v-else-if="!render_map && !active_port" class="d-flex justify-center align-center align-content-center pa-4">
                No se ha encontrado la ubicación en el Mapa.
            </div>
            <l-map v-else style="height: 500px" :zoom="zoom" :center="center">
                <l-tile-layer :url="url"></l-tile-layer>
                <l-marker :lat-lng="markerLatLng"></l-marker>
                <l-control-zoom position="bottomright"></l-control-zoom>
            </l-map>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="map = false">Cerrar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
  </v-card>
</template>

<script>

import {mapState, mapActions} from 'vuex';
import {LMap, LTileLayer, LMarker, LControlZoom} from 'vue2-leaflet';

export default {
    name:'TablePorts',
    components:{
        LMap,
        LTileLayer,
        LMarker,
        LControlZoom
    },
    inject: {
      theme: {
        default: { isDark: false },
      },
    },
    data(){
        return{
            active_port:{},
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            zoom: 15,
            render_map:false,
            center: [],
            markerLatLng:[],
            map:false,
            options:{
                page: 1,
                itemsPerPage: 10
            },
            page:1,
            search: '',
            headers: [
                { text: '#', value: 'from' },
                {
                    text: 'Nombre',
                    align: 'start',
                    sortable: true,
                    value: 'name',
                },
                { text: 'País', value: 'country' },
                { text: 'Continente', value: 'continent' },
                { text: 'Ver Ubicación', value: 'coordinates' },
            ]       
        }
    },
    created(){
      this.getPorts();
    },
    methods:{
        ...mapActions(['getPorts','getDataByPage']),
        showMap(item){
            // Comienza la carga del Mapa
            this.render_map = false;

            // Muestra el Cuadro de Dialogo
            this.map =  !this.map;

            // Se establece el Item seleccionado Activo
            this.active_port = item;

            // Se valida que las coordenadas existan
            if(item != false){
                setTimeout((event)=>{
                    // Se separan las coordenadas por espacio para obtener Latitud y Longitud
                    let cut_coordinates = item.coordinates.split(" ")

                    // Se asignan las coordenadas en cada una de sus variables
                    let latitud = cut_coordinates[0]
                    let longitud = cut_coordinates[1]

                    // Se renderiza el Mapa con la nueva localizacion
                    this.center = [latitud, longitud];
                    this.markerLatLng =  [latitud, longitud];
                    this.render_map = true;
                },1000)
            }
        }
    },
    computed:{
      ...mapState(['ports','pagination','total_pages'])
    }
}
</script>

<style>

</style>