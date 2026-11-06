-- Original constants declaration only; no runtime controller is executed.
KR_TARGET='phone';dofile('reference/apk/assets/gc64/all/constants.lua')
assert(COUNT_GROUP_CONCURRENT==1)
io.write(dofile('tools/encode_json.lua')({concurrent=COUNT_GROUP_CONCURRENT,nfAll=NF_ALL},true))
