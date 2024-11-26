import type { ListItem } from './model';

// 生成测试数据
const generateMockData = (count: number): ListItem[] => {
  const categories = ['VIP', '普通'];
  const priceLevels = ['一级', '二级', '三级'];
  const warehouses = ['北京', '上海', '广州'];
  const salesPersons = ['张三', '李四', '王五', '赵六'];
  const status = ['启用', '禁用'];

  return Array.from({ length: count }).map((_, index) => ({
    id: index + 1,
    name: `客户${index + 1}`,
    code: `KH${String(index + 1).padStart(6, '0')}`,
    quoteDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    category: categories[Math.floor(Math.random() * categories.length)],
    priceLevel: priceLevels[Math.floor(Math.random() * priceLevels.length)],
    contact: `联系人${index + 1}`,
    phone: `1${Math.floor(Math.random() * 10000000000)}`,
    quoteNumber: `BJ${String(index + 1).padStart(6, '0')}`,
    salesPerson: salesPersons[Math.floor(Math.random() * salesPersons.length)],
    warehouse: warehouses[Math.floor(Math.random() * warehouses.length)],
    status: status[Math.floor(Math.random() * status.length)],
  }));
};

const mockData = generateMockData(100);

export async function getList(params: any): Promise<{ items: ListItem[]; total: number }> {
  await new Promise(resolve => setTimeout(resolve, 300));

  let result = [...mockData];
  
  // 应用过滤
  Object.keys(params).forEach(key => {
    if (params[key] && key !== 'page' && key !== 'pageSize' && key !== 'sortField' && key !== 'sortOrder') {
      if (Array.isArray(params[key])) {
        result = result.filter(item => params[key].includes(item[key]));
      } else {
        result = result.filter(item => 
          item[key].toString().toLowerCase().includes(params[key].toString().toLowerCase())
        );
      }
    }
  });

  // 应用排序
  if (params.sortField && params.sortOrder) {
    result.sort((a: any, b: any) => {
      const factor = params.sortOrder === 'ascend' ? 1 : -1;
      const valueA = a[params.sortField];
      const valueB = b[params.sortField];
      
      if (typeof valueA === 'string') {
        return valueA.localeCompare(valueB) * factor;
      }
      return (valueA > valueB ? 1 : -1) * factor;
    });
  }
  
  // 处理分页
  const pageSize = Number(params.pageSize) || 10;
  const current = Number(params.page) || 1;
  const start = (current - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    items: result.slice(start, end),
    total: result.length,
  };
}