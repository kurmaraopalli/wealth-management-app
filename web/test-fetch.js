async function test() {
  const yahooSymbol = 'RELIANCE.NS';
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=5d`;
  
  console.log('Fetching:', url);
  try {
    const res = await fetch(url);
    console.log('Direct response status:', res.status);
    if (res.ok) {
      const data = await res.json();
      console.log('Direct response regularMarketPrice:', data?.chart?.result?.[0]?.meta?.regularMarketPrice);
    }
  } catch (err) {
    console.error('Direct fetch failed:', err.message);
  }

  const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  console.log('Fetching proxy:', proxy);
  try {
    const res = await fetch(proxy);
    console.log('Proxy response status:', res.status);
    if (res.ok) {
      const wrapper = await res.json();
      const contents = JSON.parse(wrapper.contents);
      console.log('Proxy regularMarketPrice:', contents?.chart?.result?.[0]?.meta?.regularMarketPrice);
    }
  } catch (err) {
    console.error('Proxy fetch failed:', err.message);
  }
}

test();
