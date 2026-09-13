<template>
  <div>

    <list-image-upload v-if="flag" :limit=limit :isType=isType :superiorId="id"/>

  </div>
</template>

<script>
export default {
  data(){
    return{
      id:null,
      isType:null,
      limit:10,
      flag:false
    }
  },
  created() {
    this.id = this.$route.query.id
    this.isType = this.$route.query.isType
    this.flag=true
  }

}
</script>

<style scoped>

</style>
