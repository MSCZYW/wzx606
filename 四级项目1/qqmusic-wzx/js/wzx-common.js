// 姓名：王治贤 学号：24002120606 全局公共脚本
// 通用工具：从本地数据源 wzxData 同步读取数据（不使用 mock，全部本地资源）
function wzxGetData(key) {
    return wzxData[key] || null;
}
