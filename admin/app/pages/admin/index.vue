<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-h3">
        Administration
      </v-col>
      <v-col cols="6" sm="4">
        <v-card class="pa-3 text-center" to="/admin/questions">
          <v-icon icon="mdi-comment-question-outline" size="86" color="primary" />
          <div class="text-h5">
            Fragen
          </div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="4">
        <v-card class="pa-3 text-center" to="/admin/tags">
          <v-icon icon="mdi-tag-multiple-outline" size="86" color="primary" />
          <div class="text-h5">
            Tags
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
