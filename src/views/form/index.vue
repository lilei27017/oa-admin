<template>
  <el-card class="app-container box-card">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="姓名">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="地区">
        <el-select v-model="form.region" placeholder="select your zone">
          <el-option label="one" value="shanghai"/>
          <el-option label="two" value="beijing"/>
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
        <el-col :span="11">
          <el-date-picker v-model="form.date1" type="date" placeholder="Pick a date" style="width: 100%;"/>
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.date2" type="fixed-time" placeholder="Pick a time" style="width: 100%;"/>
        </el-col>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="form.delivery"/>
      </el-form-item>
      <!--<el-form-item label="角色类型">-->
      <!--<el-checkbox-group v-model="form.type">-->
      <!--<el-checkbox label="管理员" name="type"></el-checkbox>-->
      <!--<el-checkbox label="超级管理员" name="type"></el-checkbox>-->
      <!--</el-checkbox-group>-->
      <!--</el-form-item>-->
      <el-form-item label="角色类型">
        <el-radio-group v-model="form.resource">
          <el-radio label="管理员"/>
          <el-radio label="超级管理员"/>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.desc" type="textarea"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
  .box-card {
    margin: 0 auto;
    width: 800px;
  }
  .line{
    text-align: center;
  }
</style>

