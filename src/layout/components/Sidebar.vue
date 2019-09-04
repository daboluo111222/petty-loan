<template>
  <!-- <scroll-bar> -->
  <el-menu ref="menu" mode="vertical" class="sideBar full" :default-active="$route.path"
           :default-openeds="openSubMenu" :router="true">
    <template v-for="(item,i) in sidebar">
      <el-menu-item v-if="!item.children" :index="item.path" :key="i+''" style="display: flex">
        <div :class="['Iconbg icon-'+item.name]"></div>
        <span class="sidebar-text">{{item.nameZh}}</span>
        <div class="el-icon-arrow-right icon-after"></div>
      </el-menu-item>
      <el-submenu v-else :index="item.path" :key="i+''">
        <template slot="title" style="display: flex">
          <div :class="['Iconbg icon-'+item.name]"></div>
          <span class="sidebar-text">{{item.nameZh}}</span>
        </template>
        <el-menu-item v-for="(subItem,j) in item.children" :index="subItem.path" :key="`${i}+${j}`">
          {{subItem.nameZh}}
        </el-menu-item>
      </el-submenu>
    </template>

  </el-menu>
  <!-- </scroll-bar> -->
</template>

<script>
import { isEmpty } from '@/utils/utils'
import { mapState } from 'vuex'

export default {
  name: 'Sidebar',
  data () {
    return {
      openSubMenu: []
    }
  },
  computed: {
    ...mapState([
      'sidebar'
    ]),
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  @import "~@/assets/styles/variables.scss";

  $sideBar-bg: $dark;
  $sidebar-active: $Blue;
  $sidebar-hover: $blue-hover;
  $company: url("~@/assets/images/company.png") no-repeat;
  $company-active: url("~@/assets/images/company-active.png") no-repeat;
  $branchOffice: url("~@/assets/images/branchOffice.png") no-repeat;
  $branchOffice-active: url("~@/assets/images/branchOffice-active.png") no-repeat;
  $Project: url("~@/assets/images/Project.png") no-repeat;
  $Project-active: url("~@/assets/images/Project-active.png") no-repeat;
  $functionalManagement: url("~@/assets/images/functionalManagement.png") no-repeat;
  $functionalManagement-active: url("~@/assets/images/functionalManagement-active.png") no-repeat;
  $permission: url("~@/assets/images/permission.png") no-repeat;
  $permission-active: url("~@/assets/images/permission-active.png") no-repeat;
  .sideBar.el-menu {
    height: 100%;
    border: 0;
    background: $sideBar-bg;

    .sideBar-header {
      width: 100%;
      height: 60px;
      padding: 12px 0 0 20px;

      img {
        display: block;
      }
    }

    .el-menu-item,
    .el-submenu__title {
      user-select: none;
      font-size: 16px;
      color: #637c9c;
      display: flex;
    }

    .icon-font {
      font-size: 16px;
      margin: 0 5px 0 0;
    }

    .Iconbg {
      /*height: 100%;*/
      width: 30px;
      height: 30px;
      position: relative;
      top: 18px;
    }

    .icon-constructionCompany {
      background: $company;
    }

    .icon-constructionSubCompany {
      background: $branchOffice;
    }

    .icon-project {
      background: $Project;
    }

    .icon-sysFunction {
      background: $functionalManagement;
    }

    .icon-permission {
      background: $permission;
    }

    .el-submenu {
      &.is-active {
        .icon-permission {
          background: $permission-active;
        }

        .el-submenu__title {
          .sidebar-text {
            color: $blue;
          }
        }
      }

      &:hover {
        .icon-permission {
          background: $permission-active;
        }

        .el-submenu__title {
          .sidebar-text {
            color: $sidebar-hover;
          }
        }
      }
    }

    .el-menu-item {
      .icon-after {
        position: absolute;
        display: none;
        top: 22px;
        right: 20px;
        margin: -4px 0 0;
      }

      &.is-active {
        color: $blue-hover;
        background: $sidebar-active;

        .icon-after {
          display: block;
        }

        .icon-constructionCompany {
          background: $company-active;
        }

        .icon-constructionSubCompany {
          background: $branchOffice-active;
        }

        .icon-project {
          background: $Project-active;
        }

        .icon-sysFunction {
          background: $functionalManagement-active;
        }

        .icon-permission {
          background: $permission-active;
        }

        .icon-before {
          display: none;
        }

        &:hover {
          color: $sidebar-hover;
          background: $sidebar-active;

          i {
            color: #fff;
          }
        }
      }

      &:hover {
        outline: 0;
        background: $sideBar-bg;
        color: $sidebar-hover;

        i {
          color: $sidebar-hover;
        }

        .icon-constructionCompany {
          background: $company-active;
        }

        .icon-constructionSubCompany {
          background: $branchOffice-active;
        }

        .icon-project {
          background: $Project-active;
        }

        .icon-sysFunction {
          background: $functionalManagement-active;
        }

        .icon-permission {
          background: $permission-active;
        }

        .el-submenu__title {
          .sidebar-text {
            color: #1CACED;
          }
        }
      }
    }

    .el-submenu {
      .el-menu {
        background: transparent;
      }

      .el-submenu__title {
        .el-submenu__icon-arrow {
          font-size: 16px;
          margin: -8px 5px 0 0;
          color: #3c4a5c;
        }

        &:hover {
          outline: 0;
          background: $sideBar-bg;
          color: $sidebar-hover;

          i {
            color: $sidebar-hover;
          }
        }
      }

      .el-menu-item:hover {
        outline: 0;
        background: $sideBar-bg;
        color: $sidebar-hover;

        i {
          color: $sidebar-hover;
        }
      }

      .el-menu-item:focus {
        background: $sidebar-active;
        color: $blue-hover;

        i {
          color: #fff;
        }
      }
    }
  }
  .icon-project:before {
    content: '';
  }
</style>
