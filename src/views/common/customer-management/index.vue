<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="姓名:">
          <el-input v-model="form.author" placeholder=""/>
        </el-form-item>
        <el-form-item label="时间">
          <el-col :span="11">
            <el-date-picker v-model="form.time_begin" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="选择开始日期" style="width: 100%;"/>
          </el-col>
          <span style="display: block; float: left"> - </span>
          <el-col :span="11">
            <el-date-picker v-model="form.time_end" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="选择结束日期" style="width: 100%;"/>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button type="primary" @click="showAddForm">添加用户</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="listLoading"
        :data="list"
        highlight-current-row
        height="600"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row>
        <el-table-column label="title">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center" prop="author"/>
        <el-table-column sortable label="邮箱" align="center" prop="email"/>
        <el-table-column class-name="status-col" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" prop="display_time" label="创建时间"/>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleDelete(scope.row.id)">
              删除
            </el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="showEditForm(scope.$index)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page="page.curr"
          :page-size="page.size"
          :total="page.total"
          background
          layout="prev, pager, next, jumper"
          @current-change="handleChange"/>
      </div>
    </el-card>

    <!--添加dialog-->
    <el-dialog :visible.sync="dialogFormVisible" title="添加用户">
      <el-form :model="form">
        <el-form-item :label-width="formLabelWidth" label="姓名">
          <el-input v-model="form.author" auto-complete="off" placeholder=""/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="状态">
          <el-input v-model="form.status" auto-complete="off" placeholder=""/>
        </el-form-item>
        <!--<el-form-item label="密码" :label-width="formLabelWidth">-->
        <!--<el-input type="password" v-model="form.password" auto-complete="off" placeholder="不能超过16个字符"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="确认密码" :label-width="formLabelWidth">-->
        <!--<el-input type="password" v-model="form.re_password" auto-complete="off" placeholder="不能超过16个字符"></el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>

    <!--编辑dialog-->
    <el-dialog :visible.sync="editFormVisible" title="编辑用户">
      <el-form :model="editForm">
        <el-form-item :label-width="formLabelWidth" label="title">
          <el-input v-model="editForm.title" auto-complete="off" placeholder="不能超过16个字符"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="姓名">
          <el-input v-model="editForm.author" auto-complete="off" placeholder="不能超过16个字符"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="状态">
          <el-select v-model="editForm.status" filterable placeholder="">
            <el-option
              v-for="item in editForm.state"
              :lable="item.status"
              :key="item.id"
              :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit(id)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, deleteList, postList } from '@/api/table'
import utils from '@/utils/index'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      page: { curr: 1, size: 15, total: 0 },
      dialogFormVisible: false,
      editFormVisible: false,
      formLabelWidth: '120px',
      list: null,
      listLoading: true,
      form: {
        // author: '',
        // status: '',
        // time_begin: '',
        // time_end: ''
      },
      editForm: {
        title: '',
        author: '',
        state: [
          { status: '启用', id: true }, { status: '禁用', id: false }
        ]
      }
    }
  },
  created() {
  },
  mounted() {
    // this.getTestData()
    this.fetchData()
  },
  methods: {
    // 获取数据
    fetchData() {
      this.listLoading = true
      getList('/table/list', this.listQuery).then(response => {
        this.list = response.data.items
        this.page.total = response.data.total
        this.listLoading = false
      })
    },
    getTestData() {
      getList('test').then(res => {
        console.log(res)
      })
    },
    // 翻页
    handleChange(p) {
      this.page.curr = p
      this.fetchData()
    },
    // 搜索
    handleSearch() {
      const query = utils.buildGetParams({
        page: this.page,
        author: this.form.author ? this.form.author : '',
        time_begin: this.form.time_begin ? this.form.time_begin : '',
        time_end: this.form.time_end ? this.form.time_end : ''
      })
      getList('/table/list?' + query).then(response => {
        if (response.data.total === 0) {
          this.$message({
            type: 'error',
            message: '无匹配用户'
          })
        } else {
          this.list = response.data.items
          this.page.total = response.data.total
        }
      })
    },
    // 删除
    handleDelete(id) {
      console.log(id)
      this.$confirm('即将删除，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteList('/table/delete?id=' + id).then((data) => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.fetchData()
        })
      })
    },
    // 添加
    showAddForm() {
      this.dialogFormVisible = true
    },
    handleAdd() {
      const data = {
        'author': this.form.author
      }
      console.log(data)
      postList('/table/add', data).then(response => {
        if (response.code !== 20000) {
          return false
        } else {
          this.dialogFormVisible = false
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.fetchData()
        }
      })
    },
    // 编辑
    showEditForm(i) {
      console.log(this.list[i])
      this.editForm = this.list[i]
      this.editFormVisible = true
    },
    handleEdit(id) {
      const data = {
        'id': id,
        'author': this.form.author,
        'status': this.form.status
      }
      console.log(data)
      // postList('/table/eidt', data).then(response => {
      //   if (response.code !== 20000) {
      //     return false
      //   } else {
      //     this.dialogFormVisible = false
      //     this.$message({
      //       type: 'success',
      //       message: '编辑成功'
      //     })
      //     this.fetchData()
      //   }
      // })
    }

  }
}
</script>
