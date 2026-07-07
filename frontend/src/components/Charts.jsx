import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const Charts = ({ data }) => {
  const hasIncome = data.some((d) => d.income != null);
  const hasExpense = data.some((d) => d.expense != null) || data.some((d) => d.totalSpent != null) || data.some((d) => d.value != null);
  const labelKey = data.some((d) => d.name) ? 'name' : 'period';
  const expenseKey = data.some((d) => d.expense != null) ? 'expense' : 'totalSpent';

  return (
    <div className="h-[350px] w-full flex">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis dataKey={labelKey} stroke="rgba(255,255,255,0.5)" axisLine={false} tickLine={false} />
          <YAxis stroke="rgba(255,255,255,0.5)" axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
          />
          {hasIncome && <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />}
          {hasExpense && <Area type="monotone" dataKey={expenseKey} stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;
