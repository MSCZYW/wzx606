@echo off
REM 姓名：王治贤 | 学号：24002120606 |
REM 时间：2026-11-20 | 大模型：GLM-5.3-Flash
REM 说明：启动后端服务（与 package.json 的 npm start 脚本一致）

REM 使用 UTF-8 编码，避免中文日志乱码
chcp 65001 >nul

REM %~dp0 为本 bat 所在目录，双击运行不受当前路径影响
cd /d "%~dp0backend"

REM 启动命令与 package.json 中的脚本保持一致
call npm start

REM 结尾暂停，出错时窗口不关闭
pause
