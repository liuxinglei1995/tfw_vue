<template>
  <div>
    <el-cascader
      :placeholder="placeholder"
      :options="ssqldList"
      :props="defaultParams"
      v-model="area"
      :area="area"
      style="width: 300px"
      @change="handleChange"
    >
    </el-cascader>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'area',
    event: 'change'
  },
  props: {
    area: [String, Object, Array],
    type: {
      type: String,
      default: "extName"
    },
    ssqldList:[Array],
    placeholder: {
      type: String,
      default: "请选择"
    }
  },

  data() {
    return {
      areaSplit: [],
      defaultParams: {
        value: null,
        label: 'extName',
        children: "children",
      },
    }
  },
  created() {
    this.defaultParams.value = this.type
  },
  methods: {
    handleChange(value) {
      return this.$emit('change', value)
    }
  }
}
</script>

<style scoped>

</style>
