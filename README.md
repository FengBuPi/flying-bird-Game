# 《飞翔的小鸟》项目介绍

## 项目概述

本项目是一个基于面向对象编程（OOP）思想、TypeScript 语言、单页面应用（SPA）架构和手写迷你路由器（Mini Router）的单页面小游戏——“飞翔的小鸟”。游戏采用了 Hash 模式来实现页面间的路由跳转，使得整个应用能够在不刷新页面的情况下切换不同的游戏状态。

## 技术栈

- **TypeScript**: 静态类型检查的编程语言，提高了代码质量和可维护性。
- **面向对象编程（OOP）**: 通过类和对象来组织代码，实现了模块化和可复用性。
- **单页面应用（SPA）**: 利用前端路由技术，实现在同一个页面中动态加载不同内容。
- **迷你路由器（Mini Router）**: 自定义的路由管理器，基于 URL 的哈希部分实现页面跳转。

## 主要功能

- **游戏主界面**: 显示游戏开始按钮和其他相关信息。
- **游戏进行中**: 用户可以控制小鸟飞行，躲避障碍物。
- **游戏结束**: 显示最终得分，并提供重新开始的选项。

## 启动说明

### 安装依赖

```
pnpm install
```

### 安装Liver Server

`vscode`插件搜索`LiveServer`点击安装

### 启动服务

进入`index.html,`右键选择`Open with live server`