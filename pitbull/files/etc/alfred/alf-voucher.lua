#!/usr/bin/lua

local function shell(command)
  local handle = io.popen(command)
  local result = handle:read("*a")
  handle:close()
  return result
end

local function file_exists(file)
  -- check if the file exists
  local f = io.open(file, "rb")
  if f then f:close() end
  return f ~= nil
end

local function get_text_file(file)
  if not file_exists(file) then return '' end
  local text_file = io.open(file,'rb')
  local content = text_file:read "*a"
  text_file:close()
  return content
end

function table.val_to_str ( v )
  if "string" == type( v ) then
    v = string.gsub( v, "\n", "\\n" )
    if string.match( string.gsub(v,"[^'\"]",""), '^"+$' ) then
      return "'" .. v .. "'"
    end
    return '"' .. string.gsub(v,'"', '\\"' ) .. '"'
  else
    return "table" == type( v ) and table.tostring( v ) or
      tostring( v )
  end
end

function table.key_to_str ( k )
  if "string" == type( k ) and string.match( k, "^[_%a][_%a%d]*$" ) then
    return k
  else
    return "[" .. table.val_to_str( k ) .. "]"
  end
end

function table.tostring( tbl )
  local result, done = {}, {}
  for k, v in ipairs( tbl ) do
    table.insert( result, table.val_to_str( v ) )
    done[ k ] = true
  end
  for k, v in pairs( tbl ) do
    if not done[ k ] then
      table.insert( result,
        table.key_to_str( k ) .. "=" .. table.val_to_str( v ) )
    end
  end
  return "" .. table.concat( result, "," ) .. "\x0a"
end

local type_id = 70 -- voucher

local function get_vouchers()
  local db = dba.load(config.db)
  return db.data
end

local function publish_vouchers()
--  local config = require('voucher.config')
--  local dba = require('voucher.db')
--  local logic = require('voucher.logic')
--  local ft = require('voucher.functools')

-- pass a raw chunk of data to alfred
  local fd = io.popen("alfred -s " .. type_id, "w")
  if fd then
    local ret = get_vouchers()
    for key,value in pairs(ret) do
      fd:write(table.tostring(value))
    end
    fd:close()
  end
end
local function write_bat_hosts(rows)
  local content = {}

  -- merge the chunks from all nodes, de-escaping newlines
  for _, row in ipairs(rows) do
    local node, value = unpack(row)
      table.insert(content, value:gsub("\x0a", "\n") .. "\n")
  end
  print(rows)
  -- write parsed content down to disk
  local fd = io.open("/tmp/alf-voucher.csv", "a")
  if fd then
    fd:write(table.concat(content),'\n')
    fd:close()
  end
  shell('awk -F \'","\' \'!seen[$1]++\' /tmp/alf-voucher.csv | tr -d \\" > /tmp/voucher.csv')
  os.execute("ln -ns /tmp/voucher.csv /etc/voucher/db.csv 2>/dev/null")
  os.execute("captive-portal")
  -- execute captive-portal

  -- try to make a symlink in /etc pointing to /tmp,
  -- if it exists, ln will do nothing.
  -- os.execute("ln -ns /tmp/bat-hosts /etc/bat-hosts 2>/dev/null")
end

 local function receive_bat_hosts()

   local fd = io.popen("alfred -r " .. type_id)

   if fd then
     local output = fd:read("*a")
     if output then
       assert(loadstring("rows = {" .. output .. "}"))()
       write_bat_hosts(rows)
     end
     fd:close()
   end
 end

--publish_vouchers()
receive_bat_hosts()