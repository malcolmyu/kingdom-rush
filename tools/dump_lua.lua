local function quote(s)
  local escapes = {['"']='\\"', ['\\']='\\\\', ['\n']='\\n', ['\r']='\\r', ['\t']='\\t'}
  return '"' .. s:gsub('[%z\1-\31\\"]',function(c) return escapes[c] or string.format('\\u%04x',string.byte(c)) end) .. '"'
end
local function encode(t)
  local kind=type(t)
  if kind=='string' then return quote(t) end
  if kind=='number' or kind=='boolean' then return tostring(t) end
  if kind~='table' then return 'null' end
  local n,count,array=#t,0,true
  for k in pairs(t) do count=count+1; if type(k)~='number' or k<1 or k>n then array=false end end
  local out={}
  if array and count==n and n>0 then
    for i=1,n do out[#out+1]=encode(t[i]) end
    return '['..table.concat(out,',')..']'
  end
  for k,v in pairs(t) do out[#out+1]=quote(tostring(k))..':'..encode(v) end
  return '{'..table.concat(out,',')..'}'
end
io.write(encode(dofile(arg[1])))
