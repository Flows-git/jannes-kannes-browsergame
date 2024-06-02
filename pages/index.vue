<script setup></script>

<template>
  <v-container class="d-flex justify-center">
    <v-card width="600">
      <v-card-text class="text-center py-8">
        <div class="d-flex align-center justify-center">
          <div>
            <div class="text-h1 font-weight-bold text-center">
              <div class="wc3-color-gradient">
                JANNES
              </div>
              <div class="wc3-color-gradient">
                KANNES
              </div>
            </div>
            <div class="text-end text-h5 align-self-end ml-n8 mt-n4">
              Das Spiel
            </div>
          </div>
        </div>
        <div class="pt-8">
          <v-btn color="primary" to="/game">
            Spiel starten
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style>
.wc3-color-gradient {
  background: rgb(255,255,255);
  background-image: linear-gradient(0deg, rgba(255,255,255,1) 25%, rgba(253,227,22,1) 50%, rgba(255,69,0,1) 75%) !important;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
