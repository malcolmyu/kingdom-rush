# 第4–6关还原工作区

0.2.139实际闭合狂野魔术师「破坏守卫」ward三级购买/施法/沉默与恢复链。原每档225/max3/目标数1、3、6，10秒strict冷却、14/30施法；第一档changed被outerloop观察才起cd，后两档不重置，首观察前连升保留原ts0。source F_SPELLCASTER2147483648且can_do_magic、原范围/vis门选最前排序列表；cast开始捕获列表，释放时不擅加新range/vis/magic门，取当时等级上限queue mod，释放后再记冷却ts。已开始phase不因tower.blocked中途冻结。s.wild.powers独立，塔810+技能675=spent1485/战斗退891；eldritch与普通交替手/same计数保持。

原mod_ward经game_scripts共享scripts表继承mod_silence.insert/remove（4889–4921）与mod_track_target.update（4263–4300），APK没有KR3 override；controllers仅-bl不执行。insert只有实体/health alive/enemy门，原can_do_magic/can_accept_magic直接false，remove对仍在entities的enemy直接true，不虚构引用计数或保存prior false；未改外部stunned/frozen、Arcane/Blade stun计数。同级重复仅刷新modifier.ts、不重置tween年龄；低级拒绝，高级替换；strict now-ts>10或死亡/移除后释放自己状态。不同外部沉默的完整通用组合生命周期仍不是已实现的通用引擎，不能声称全部原mod都闭合。

真实职责接到既有blighter封花新episode与harasser.requires_magic闪避门；原已有普通近战/箭仍正常。重要源细节：blighter能量attack声明requires_magic=true，但仅SU2693–2756新目标获取检查magic；已进入的ranged episode在can_range_soldier2309–2325与range_attacks2937–3131不再检查magic，直到目标失效/episode退出。所以本批没有凭直觉取消已开能量或给持有目标加新全局门；新增纯测确认已提交弹与连续episode照原继续，新获取被阻。已进入封花cast按原y_wait只被death/stun等打断，沉默不回滚已提交动作。完整原game_scripts8647–8723与SU138–157也只读审计。

原ward.bans四项中本关真实存在mod_gnoll_boss：插入后撤原HPbonus/factor并禁止pending/后续重入，过期允许原aura继续，不假阻gnawer等不在列表的增益。其他更后关卡尚无runtime的heal/consume/shadow_champion仅声明不冒已实现。本批未修改旧五关RNG/伤害/HP/施法clock；只有实际ward插入才有canDoMagic/canAcceptMagic/World.wildWards新状态。

原塔sprite5/6按source独立alpha keys（2/30→16/30淡入、25/30保持→1秒淡完），rune7原25frame后隐藏、body wardUp/Down32frame；纯draw按Worldclock，offset tween/anchor/z原样，overlay不假跟shooter.flip。目标头标原custom_offsets（blighter y39）、不再叠unit.mod_offset；两地贴z1400，其中原scale1/.4是真双轴，不套Renderer.entity旧等比scale。三mod sprite独立原0/.25/9.75/10 alpha keys并跟目标移动，same-rank刷新不重开显示年龄。真实pause冻结，卖塔不清除已经插入的modifier，丢World/换场景无timer/cache回填。

extract_wild_magus.py增加原mod_ward声明、10控制/声明源码SHA（含constants）、原PNG历史pin与实际render用go_towers/go_decals Lua声明SHA、输入catalog SHA；同一原PNG历史pin仍只读验证，未因删除未用图跳过源校验。发现此前递归所有组件字符串，把modifier.bans法术名误当动画依赖：第一次新pack490帧中多50帧无关evoker heal；改只从实际render.sprites/prefix/name闭包取完整动画后，原439中也移去124个未用ban引用/独立UI portrait等帧，新加1个原silence_fx，最终316帧608316B。所有实际普通bolt/eldritch/ward/塔层完整，逐RGBA/size/trim无损验证；不是降质/清alpha0RGB。原肖像仍从独立UI原PNG取，不依赖战斗sheet。野法metadata只level6读、mage3菜单/交易前完整decode原事务保留。旧compact1314frames2122316B、三个stage图1925/1815/2204与4090840/3175904/4109998B不变。

598Node全过（8新ward）。actualbuild ward-browser-final/publish真实塔升级与原3ettin收益付款，再10ettin原收益700支付225x3，最终25gold/spent1485；真Space开wave1，受控原道路节点6个原blighter，World.step自动cast→6mod→实际false魔法门→10秒后true并重新封花。中途真实菜单卖塔退891，最终916gold，modifier照原继续。没有改HP/gold/伤害/cd/seed/路径终点；源码严格门都保留。头标/两地贴/rune的原Canvas q/alpha/矩阵/六个1,.4 scale，draw全字段World快照（循环引用安全序列化）不变/无missing-unready、真pause/wheel/844x390 CDP touch/map清理通过。cast/muted/mobile图人工看，是受控第6fixture，非天然新技能通关/原版同输入pixelcert。

最初全字段JSON快照遇SpellTimeline.world循环，是fixture序列化错误，改WeakSet明确共享引用后publish-full-repeat正常，不改产品/不吞绘制差分。最初render-only提取被历史unused PNG pin集合检查正确挡住，改仍验证所有历史PNG原字节、仅不载入未用图到pack；实际源pins没有放宽或替换。一次在build cwd改测试路径失败但HTTP已起，随后从repo纠正fixture，未改产品数值。最终source pin重提、运行模块/新包逐字节等actualbuild，所有失败日志保留，不冒初包作最终。

原完整天然九模式/手机存档ward-old-nine、连续新档1–4→5→6 ward-natural4/natural5/natural6保持（4campaign19命三星/heroic142/iron95；5campaign20命/heroic201/iron147/XP37600；6campaign20命零漏/764kill772spawn→heroic120/iron169/XP47121），但第6当前自然计划仍mage3，不冒wild新技能自然通关；recordVictory6仍cap5拒绝，没有伪造星/解锁。普通wild、eldritch、boss aura实际Canvas回归与UI均正常exit0；原人类援军叠音修复保持，本批没再改音频。

生产仍前五关15模式，第6closed。wild两技能基础连续链现在均完成；下一批应集中原flag6/道路/book6/通知/recordVictory cap6与真正浏览器自然三模式、手机重载、最终真实旗书冷路径发布验收，不继续无限小修同ward/eldritch/HUD/pack/boss基础。第6实际browser必须真实等待第14波事件图decode、最后未ready冻结/重试返回地图规则，不设假的ready或循环推World跨过网络等待。首次6前置用真实stage5-earned XP37600或真实已赚浏览器checkpoint，不拿末XP47121冒首次成长。ward原施法音效尚未接；整体原grid/nativequeueIDs/globalz/特殊death/血池/完整音频/安全区/Arivan/宝石天赋仍欠，非完整1:1。

最终actualbuild1663文件96121177B含manifest，136个运行模块/新图组文件逐字节等源。最终四cold100ms/1.5MBps/cacheoff：旧14850057B/240req book7.216总16.970s；第4真实旗书14807430B/230req book7.179总17.009；第5真实旗书14990735B/241req book7.870总17.750；第6隔离14854693B/234req book6.752总16.884，15MB全正常exit0，不保所有线路。第五仅余9265B，下一批原6发布数据必须按真实依赖无损加载，不能抬门/降质/删除当前必需图。第6仍不是已发布flag6/book6路径，boss/cart阶段还会额外真实下载3.87MB，不冒全局整局流量15MB。

最终ward-browser-publish-full-repeat正常exit0（完整World循环安全快照），ward-old-nine/UI、原natural4/5/6、基础wild/eldritch/aura回归全exit0；全部性能与ward-pages-ui也正常exit0，无挂住browser待收。本轮公开一次manifest确认.138，新推送不轮询，不冒已确认公开.139。主要logs artifacts/ward-source-pinned/tests-final/build-final/browser-publish-full-repeat/old-nine/ui/performance/stage4-performance/stage5-performance/stage6-performance/pages-ui/natural4/natural5/natural6/eldritch-regression/base-regression/aura-regression.log。ward-browser-publish-full.log是原循环JSON错误fixture，repeat才最终；原ward-source-first490帧是早期含多余heal图，不作为最终资源组。

0.2.138实际闭合狂野魔术师eldritch三档购买/射线/吞噬/延时魔法AOE基础连续链。原325/185/185、max3，累计spent1505（塔810+技能695）、战斗退款903；仅s.wild.powers独立状态，ward仍disabled与World拒买。第一档changed被controller观察才起28秒strict冷却，后两档24/20秒不重置起点，首观察前直升2档保留模板ts0。原20/30射线释放、34frame施法，开始后不被tower.blocked中途冻，释放重新核health/vis/1.1椭圆，失效则按原范围重找最前目标；不改普通双手same计数或抽新chance随机。

原game_templates注册ray_wild_magus读取game_scripts.ray_simple，但APK game_scripts实际上require并返回共享scripts表且无ray_simple override，故继承all/scripts3242–3353及3248闭包，不是精灵force_motion。射线2/30后queue mod、没有普通直接伤害；追踪Chebyshev上限64相对insert时原bullet.to（非逐tick累积重置），F_RANGED或超距粘性失追，仍原hitFX但不插mod。射线原16frame/anchor0,.5/z3400，x轴距离/image_width144而y轴保持1，专用Canvas双轴矩阵，不把Renderer.entity旧等比scale当源射线正确；原hitFX/z3300。

mod下一Worldtick插入，只活/实体存在/源modifier flags门成功；同级不重复启动，高级替换低级，低级拒绝。再下一Worldtick按原systems.health DAMAGE_EAT4096令HP0，检查原health.ignore_damage/immune_to，真实一次原金币/无主英雄假XP，carrier继承原EAT禁落兵/隐藏死亡，不用超大普通伤害冒吞噬。原敌闲置render快照按eldritch_enemy_decal 0..20/30抖动scale tween膨胀，隐藏正常尸体；mod原12frame loop跟初始mod_offset，等待20/30结束后原19frame爆炸。AOE在固定初始mod.pos、87.5/.7椭圆按源flags筛活敌，下一tick80/180/260固定magic4，不乘塔damage_factor、不抽伤害随机。爆炸画面在原target引用当前pos+unit.mod_offset，和AOE中心职责不混淆。完整native modifier ban列表/queueIDs/协程同tick、敌render运行时多层快照、额外blood/pop/水格/声音尚适配或欠，不能说全部技能FX/全塔1:1。

extract_wild_magus.py扩原ray/mod/decal/两个FX声明，10源码SHA（新增constants）与原PNG SHA pin重提拒变，controllers仅-bl不执行；read_wild_functions安全stub记录注册并审计共享scripts继承，rules只读constants+原升级proto。独立wild组368→439帧、672348→825870B，所有RGBA/size/trim无损逐帧验；仍仅level6读metadata、mage3高级菜单/交易前完整decode，不进已发布五关冷图。旧compact1314帧2122316B与三stage图1925/1815/2204帧4090840/3175904/4109998B不变，运行模块排除优化器字面量污染。原技能层未假启用ward。

590Node全过（9新eldritch）。实际build eldritch-browser-release原真实100/160/250/300塔升级与3原ettin奖励付款，再10原ettin死亡收益700支付325+185+185，最终5gold/spent1505。真实Space开波后受控原路径节点ettin/时钟，经World.step自动施法/射线/吞噬，金币5→75为原ettin70奖励；再放原邻敌测试实际260magicHP下降、范围外100单位仍900HP，没有写gold/HP/伤害/seed/cd。Canvas射线q/alpha/x独立缩放旋转矩阵、原mod/源膨胀体/无missing-unready与draw完整World快照不变；真pause冻结待爆、wheel/844x390 CDP touch/map清理均过。ray/swelling/mobile已人工看，是受控第6fixture，非天然新技能通关/原版同输入pixelcert。

早期pure把买技能前gold当吞噬前gold，少算325；另新绘制stub缺frame，均改fixture。首实际Canvas矩阵确证Renderer.entity旧scale只乘x成等比，不适合原射线，实际增加专用非均匀绘制后repeat/release通过，不吞矩阵失败。最后补原ray64相对固定bullet.to与同级mod/immune回归，590全通过后重build/重浏览器。原普通wild回归保留（零gold下eldritch不可付，不再误说未实现），ward仍锁。

生产仍前五关15模式，第6closed；下一批实际闭合ward原技能/沉默职责，再集中真正第6浏览器自然三模式/原旗路书通知奖励cap6与手机重载/真实发布冷路径，不无限磨已完eldritch/普通bolt/旧HUD/boss。连续自然4/5/6合法样本保持通过，6当前策略只mage3，不能拿它冒新技能自然验证；recordVictory6仍cap5拒绝，没有伪造存档开放。人类援军叠音.132已修保持，本批未改音频。

最终包590纯测/eldritch-browser-publish/UI正常exit0；连续自然4/5/6与原天然完整九模式/手机存档、普通wild与事件资源失败重试/取消均正常exit0。最后仅新增队列伤害按原health.ignore_damage/immune_to同时保护EAT与magic后，再重提pin/重590/build/专项/UI/四预算全过；旧五不存在此state/队列，算法与RNG不改。全部运行模块及wild新资源135文件逐字节等actualbuild，1662文件96348236B（含manifest）。本轮公开一次manifest确认.137，eldritch-pages-ui正常exit0，新推送未轮询，不能冒已确认线上.138。

最终cold100ms/1.5MBps/cacheoff旧14846330B/239req book6.282s总16.073s；第四真实旗书14803703B/229req book7.185总17.037；第五14987008B/240req book7.842总17.674；第六隔离14852065B/233req book6.741总16.839，均<15MB不保所有线路。第五只余12992B，后续大声明/图严格level6按需；第6不是已发布flag6/book6入口，boss/cart阶段另真实下载约3.87MB不能冒整局总流量15MB。主要logs artifacts/eldritch-source-pinned/tests-publish/build-publish/browser-publish/ui-publish/performance-publish/stage4-performance-publish/stage5-performance-publish/stage6-performance-publish，以及base-regression/assets-regression/old-nine/natural4/natural5/natural6/pages-ui.log。早期失败已收齐，没有挂住浏览器待收。

0.2.137实际闭合第6狂野魔术师基础升级/攻击链，不再把原未锁列表当作已实现。保留四基础TYPES，运行时mage level4映射原tower_wild_magus（原模板tower.level1不改）；仅第6允许且按mode原locked_towers再验，第4/5仍锁。真实mage1→2→3→wild价格100/160/250/300，累计810，准备期全退、战斗退款486；action_arg拒high_elven假升。原wild菜单两项eldritch/ward尚未实现，保持disabled、World拒付，不给s.arcane冒身份。原info肖像portraits_towers_0007直接PNG exact裁图，UI624图，InfoBar与tooltip按魔法塔/8–16/范围180原数据，当前已实现的crystal_focus/bane_spell按原upgrades TDUP73/75明确包含该塔/弹体，分别ceil范围*1.05与原伤害*1.15；模板只读。

web/wild-magus.mjs独立状态，原strict>.3秒cd/4帧释放，先右手再左手、8帧施法动画，source release只重验1.1倍椭圆，不凭感觉加健康/vis门。target对象相同的连续成功释放递增same，非命中计数：floor(base+min(24,.5*same))，前两发仍8–16、第三发9–17，最大32–40；换对象清零。原手/朝向弹口、shooter offset tween后再加y30判朝向，idle按原目标复算、长闲3秒朝右下。普通攻击本身不抽chance1随机。已开始phase不被tower.blocked中途冻结，新episode被禁。

重要继承链经安全stub-tag reader实际核实：bolt_wild_magus继承scripts.bolt.insert/update（原all/scripts2921–3074），不是game_scripts.bolt_elves！generic insert只查实体/F_RANGED，不凭感觉拒死目标。按原FPS30*ceil(mspeed/30*.25)每当前模拟tick增长、30..2100夹值，while旧距离>旧speed*dt才跟踪并移动，Chebyshev位移strict>128或F_RANGED后粘性失追，失追/死亡仍飞到to并有FX、不虚构HP损伤。结束准确snap到to，仍合法活目标才ceil(frandom8..16*factor)经原魔法伤害链，没火DOT/额外dodge。rotation指向移动后的to，不套箭抛物线/精灵force_motion公式；alpha按原4/30从0到255。当前World队列/实体身份/协程tick与queued damage仍适配，非同输入native逐帧全复刻。

source 17sprite中的地形/两塔层/射手/10浮石与隐藏技能层保持原anchor/z/sort_y_offset；offset tween按原各自ts/2秒loop纯采样，只绘制不写World/RNG。renderer进同actorqueue，projectile用原flying动画/anchor/alpha/角度，hitFX在to/z3300。完整粒子尾迹/pop/blood/audio/高级global talent empowerment-alter_reality和通用modifier/native ID生命周期仍未全，不能称全塔或第6完成。当前高阶全局天赋本来未列TRAINABLE，不新增假购买/假传送。

extract_wild_magus.py只读-bl审计原game_scripts520–697/all scripts2921–3074/utils245–332与升级proto；read_wild_functions.lua用原templates声明+脚本stub记录真实函数路径，不执行controllers；read_wild_magus_rules.lua只loadfile/jit.util.funck取原升级TDUP，不调用chunk或patch函数。9源码SHA与原PNG SHA固定并重提拒变，368帧672348B独立wild-magus组RGBA/size/trim全校验，仅level6取metadata、三级法师升级菜单显示/交易前才decode该组，source controllers永不运行。优化器排除独立wild运行模块的绘制字面量，旧compact仍1314帧2122316B；stage04/05/06仍1925/1815/2204帧与4090840/3175904/4109998B（仅runtime审计SHA更新），没把高级塔整图塞旧cold。完整extract_campaign/build接新工具与gzip。

581Node全过（7新wild）。actualbuild wild-browser-final真实菜单支付100/160/250，初600剩90；3个原ettin真实死亡收益各70后才付300升级，最终0gold/spent810，未直接写gold。真实点击清焦点后Space开wave1，受控原路径节点ettin/时钟隔离，经World.step自动右/左施法、同目标same>=4与实际魔法伤HP（hit14/14/15/11/13，原ettin随后回血，不用末HP当累计伤害）；source Canvas原q/alpha.125/旋转矩阵/位置、13个wild包塔层+1弹体（地形另用原common）/无missing-unready，draw完整World快照不变，真pause/zoom/844x390 CDP touch/map清理unlocked1通过。cast/purchased/mobile图人工看，受控fixture非天然第6/原版同输入pixelcert；塔菜单与旧InfoBar安全区/原全GUI仍非完全同步，不拿截图冒全UI像素验收。

初pure误把4/30精确浮点采样当必到释放，改下一原frame采样；误认crystal_focus为1.2，核原声明实际1.05后改fixture，不改产品阈值/数值。首browser误计15个wild包图，实际地形在旧common所以14，已按源分组纠正；第二次Space被旧菜单按钮focus正确门挡住，改真实canvas点空白释放focus再Space并断言wave1，没有移除产品输入门。最后补InfoBar魔法类型与等原.4秒展开后截图，重新581纯测/build和专项/UI/四预算全过。wild-browser-first/repeat失败保留，wave/final成功。

第6仍closed，生产前五关15模式。尚欠此塔eldritch/ward技能购买/施法分支、原全音效粒子/native modifier等与真正第6浏览器自然奖励链/flag6路book6通知/savecap6/手机重载，不能以基础塔接通称18完成。下一批应实际推进原eldritch或ward完整必要流程，再集中第6真实发布验收，勿无限磨普通bolt/悬浮/旧HUD/已完boss与资源包。

最终actualbuild1661文件96174185B（含manifest），全部web运行模块/新wild图组与build逐字节相同，pin重提成功。原天然完整九模式/存档手机wild-old-nine、连续新档1–4→5 wild-natural4/natural5（4campaign19命三星/heroic142/iron95；5campaign20命/heroic201/iron147/XP37600）、stage6 assets事务回归、UI与公开.136 UI正常exit0。末次InfoBar仅wild类型修正后重新纯测/build，wild-browser-final/ui-final及四冷路径全部正常exit0，无产品/browser挂住待收。

最终cold100ms/1.5MBps/cacheoff旧14839326B/238req book7.166s总16.969s；第4真实旗书14796699B/228req book7.213总17.128；第5真实旗书14980006B/239req book7.895总17.809；第6隔离14843692B/232req book6.793总16.929，15MB都过、不保所有线路。第五余19994B，未来技能大数据只level6按需，不能全局raw导入挤爆旧五。第6不是发布的flag6/book6路径，全事件阶段仍需额外3.87MB boss/cart实际decode，不能冒整局传输<15MB。主要logs artifacts/wild-source-pinned/tests-final/build-final/browser-final/assets-regression/old-nine/natural4/natural5/ui-final/performance-final/stage4-performance-final/stage5-performance-final/stage6-performance-final/pages-ui.log。

0.2.136实际解决第6隔离冷入口预算：stage06共享帧改按实际render.sprites与已审计runtime模板闭包选取（含fixed Alleria/gryphon/guards），2204帧4,109,998B，所有保留帧RGBA/size/trim逐一验证；旧stage04/05图片字节与旧1314帧2,122,316B塔compact不变。boss/cart完整原图与元数据均保留，但campaignEnemySheets不再在开场预载两张结局sheet；campaignEventSheets只在campaign6声明，heroic/iron不取boss/cart包。第14波（最后一波之前）真实开始异步预解码，两个完整sheet都decode后才能标ready。不是删除必需图或假load，也不在原事件生成之后补图。

新Stage6EventAssets绑定World/scene/version，失败不吞错：提供真实重试按钮。若最后普通波清空时仍未ready，stage6AssetsWaiting禁止World.step前进及交易，原父controller仍留waves，结局/金币/HP/RNG/时钟不变化；用户重试成功才恢复原2秒等待/囚车/首领链。第14波预加载时正常战斗不停，HTTP等待不消费World RNG；已解码图可复用现Renderer只读cache，但旧owner/销毁/换版本的迟到Promise不得设置World ready或重建UI。没有后台timer或跨World结局状态。

574 Node全过（3新资产事务纯测）。actualbuild event-assets-browser故意abort真实boss图片，验证最终事件与Worldclock禁止提前启动；844x390 CDP真触摸重试成功，真实cart/boss sheet全decode后parent到fight，Canvas无missing/unready；独立fresh page hold请求→退地图→放行验证旧World不回填ready、UI不复活。完整ending-browser在受控最后波fixture中由父controller排队首领→真实召唤→死亡→won，含源Canvas矩阵/暂停手机清理；aura/guards、三关场景专项、原天然完整九模式/存档手机与UI回归通过。三场景老fixture仍断言base四关，发现现已发布五关后只修期望5，产品cap未改。

新增tests/stage6-strategy.mjs/stage6-natural.mjs可复现合法自然测试：先原tests/stage4-natural→stage5-natural从新档真正赚XP37600/星，再用trainHeroSkill/buyUpgrade真实预算。第6campaign20命/0漏/764kill772spawn（首领死亡原无奖励清场8个）且boss death-complete/父complete；以实际战斗XP43810续heroic120/120零漏→XP45926续iron169/169零漏→末XP47121。只有隔离World之间续实际已赚战斗XP，不写World金币/HP/伤害/冷却/seed/路径终点，也不伪造星/解锁；recordVictory(6)被当前cap5正确拒绝。结果battleReady=true/releaseReady=false，是当前模拟的自然三模式，不是实际发布浏览器奖励链或原版同输入像素验收。

早期合法方案campaign10/7命、heroic过、iron失败保留在ignored artifacts。iron初计划错误尝试锁住的archer/barrack，后用允许的mage/rock；低级平铺仍漏burner，诊断源当前防守终点约574,475而非道路最后559,583，没改产品终点或敌人值。最终先合法mage6三级/mage10一级、英雄道路点450附近，再按计划升级通过；不要把错建造类/站位当产品bug。实际原rules第6campaign/heroic不锁tower_wild_magus，当前尚未实现此高级法师塔，是新确认发布缺口；不是基础mage3或Arcane替身可以冒全源能力已齐。

最终cold100ms/1.5MBps/cacheoff旧14833279B/237req book7.234s总17.049s；第四真实旗书14790652B/227req book7.182总17.039；第五真实旗书14973959B/238req book7.859总17.647；第六隔离真实title/save/map/book入口14831551B/230req book6.641总16.707，15MB全部正常exit0。不抬预算/降质/清透明RGB/漏当前必需帧，不保所有线上线路；第6完整事件阶段还会实际下载约3.87MB原图，不能把冷入口<15MB写成全局整局传输<15MB。第五只余26041B，未来大模块/图必须按本关依赖。

生产仍前五关15模式，第6closed：必须先补原允许wild magus必要升级/战斗功能，之后完整浏览器自然三模式/源旗路书页通知奖励cap6与实际发布冷路径/手机重载都验收，再称18模式。初隔离预算通过不等于真实flag6/book6入口已过。全量提取/分组/build可重建，运行模块逐字节等实际build；本轮最终包1655文件95434801B含manifest。主要logs artifacts/event-assets-tests/build/groups-final/browser/ending/guards/aura/scenes-repeat/old-nine/ui/natural4/natural5/natural6/performance/stage4-performance/stage5-performance/stage6-performance/pages-ui.log；首scenes.log是旧fixture失败，repeat已正常。

末次补充等待/失败界面的真实“返回地图”按钮，避免网络故障只能重试；独立hold请求后实际点击该按钮、放行请求，确认旧owner不回填。574纯测重新全过，最终build1655文件95435058B；event-assets-browser-final、stage5-performance-final和stage6-performance-final全部正常exit0，最终第五14974216B/238req（book7.881s总17.751s），第六14831808B/230req（book6.690s总16.879s），第五余25784B。旧九/第4/旧预算为按钮补充前同模拟包通过，最后仅第6网络等待UI变更，无战斗/源帧/RNG修改。最终所有web模块与build逐字节一致。

0.2.135实际接通campaign第6父level06结局：最后普通波次真正结束且无活敌后等2秒，源遮幕/2秒镜头/隐藏GUI，囚车从visible.left−132、y459以47速行至120,459；到位仍yield一次、下一tick才open；open动画83/30后按原nearest_nodes默认lane1取最近节点+1，下一模拟tick生成真实eb_gnoll并连接现megaSpawner。3/30后只前五sprite降Z_DECALS1400，第六保留3000/sort_y_offset−10。父状态读取实际gnollBoss.phase，只有进入loop才恢复镜头/GUI；等待dead→death-complete后再1秒且wavesfinished无活敌才放行原胜利门。普通15波清空不再是假won或永远无条件拦截。heroic/iron原结束链不加囚车。

stage6-ending.mjs只改该World的状态，Stage6EndingView纯读Worldclock驱动原黑幕out-cubic与镜头in-out-quad；源相机目标(120,500)/zoom2→(512,384)/zoom1，使用现BattleCamera边界适配，不称原native camera完全同步。隐藏GUI期间真实交易/英雄移动/施法/鼠标镜头/键盘入口禁止，模拟继续；暂停则Worldclock/车/镜头停止，返回地图销毁遮幕/inert与owner。原协程yield/原动态nav-grid/native队列ID、音频、全死亡与屏幕震动仍欠或适配，不称完整1:1。

原六层walk1..22、open23..181共1086逻辑帧，101唯一裁片/1,299,296B独立stage6-ending图组，原PNG/quad/size/trim/RGBA逐帧无损校验；只campaign6按需读取声明并完整decode，旧五关不下载车图。当前第6入口仍全量decode boss+cart，预算明确尚未完成；不以将来事件用图假延后/抬15MB/降质冒过关。extract_stage6_ending.py固定7原源码SHA和原图SHA，helper只loadfile+jit.util.funck读取level06相机TDUP与声明constants，控制器仅-bl审计、不执行。完整extract_campaign/build可重建。

实际build ending-browser-repeat从真实Space开波后受控清到最后波，父controller自行驶入/开笼/排队真实首领→吼叫触发真实召唤→恢复GUI→真实hurt击杀→death-complete→最终won，Canvas六原图/alpha/无missing或未decode/draw完整World快照不变、真pause/zoom/844x390 CDP触摸/地图清理通过。截图人工看过；这是受控最终波样本，不是自然第6通关或同输入pixelcert。首浏览器发现新view将guiReference直接传给需reference包装的视口函数，实修并重建后完整通过，失败日志保留。571 Node全过（5新结局）。生产仍前五关15模式，第6继续关闭，天然三模式、自身15MB、原旗路书页/通知/奖励cap6尚未验收，不称18模式完成。

最终571 Node全部通过；actualbuild ending-browser-publish含增强的六层原quad/alpha/相机矩阵断言、到位yield边界、真实parent/boss/召唤/死亡收尾与手机清理正常exit0。最终ending-old-nine-publish完整原天然九模式/存档手机、ending-ui-publish、连续新档1–4→5自然链都通过：4campaign19命三星/heroic142/iron95，5campaign20命/heroic201/iron147/XP37600。最后仅第6到位yield与source审计SHA补齐后重build，旧九/UI与三旧冷路径又在最终包完整通过。stage04/05/06组重提仍1925/1815/2446帧与4090840/3175904/4490674B，stage05只更新runtime模块SHA。旧compact仍1314帧2122316B。所有运行模块与新cart资源逐字节等actualbuild；最终包1654文件95836038B（含manifest）。

最终冷100ms/1.5MBps/cacheoff旧14829462B/236requests、book6.251s总15.957s；第4真实旗书14786835B/226req、book7.192s总16.970s；第5真实旗书14970143B/237req、book7.838s总17.601s，仍<15MB，不保所有线路。第五仅29857B余量，未来第6大数据/图须按需。第6真实title/save/map/book后隔离入口19080032B/231req、book9.470s总19.531s，15MB assert明确正常exit1，不称通过；basecatalog/progress/draw不变、无missing/unready，包含真实完整boss+cart。不是已发布旗6/书6，也不是自然第6通关。下一批应实际解决该关依赖/事件前decode/owner事务与自然三模式，再接真实旗书奖励cap6，不再无限磨已完结局/基础boss/aura/HUD。援军短音单voice修复保持，本批未改音频。

主要logs artifacts/ending-tests-final/build-publish/browser-publish/old-nine-publish/ui-publish/performance-publish/stage4-performance-publish/stage5-performance-publish/stage6-budget/natural4/natural5/boss-regression/source-final/groups-final，初ending-browser-first为已修的视口包装错误，不能冒最终成功。所有测试进程结果收齐后交付。

0.2.134接通第6首领gnoll_boss_aura/mod_gnoll_boss完整当前可用分支。原enemy insert排队aura，下一模拟tick插入后立即首周期、之后每>=5/30秒最多一次；track_source随原boss当前位置，死亡/移除停止生产。原radius150/.7椭圆、filter_source、F_MOD4/F_FRIEND1024筛选，stun不停止aura。每次生产mod先排队，下一tick按目标对象身份插入；同级resets_same只刷新ts，不重复加HP/系数/重置显示年龄。原固定level1，本批不假实现通用多级/ban modifier引擎。

mod在插入时加floor(当前maxHP*.5)且HP同加，保存bonus；unit damage factor乘1.5。离圈后不再刷新，strict now-ts>.2或目标死亡/移除才撤销，原remove减保存bonus的maxHP/HP并ceil(unitFactor/1.5)，不归一化抹掉原ceil对叠加系数的影响。只有实际中此新修饰器的第6目标创建gnollDamageState，和现gnawer.factor乘除同步，gnawer引用/时长与sleep/dance stun计数保持独立。HP撤回可致死，按原systems.health观察HP<=0，复用既有死亡/奖励而不加英雄XP；World.hurt的旧死亡段抽为finishEnemyDeath，旧调用数值/RNG不变。

普通近战按原ceil(integer_random*unitFactor)后交现伤害链，信息栏读取同一系数。已核SU.ranged-loop2834–2895/普通ranged和arrow→create_bullet_damage，箭弹读取attack/bullet.damage_factor，不偷读source.unit.damage_factor，所以本批不凭感觉给普通箭/energy乘1.5；纯测确认已buff harasser箭仍原20–30。完整native队列/ID/同tick生命周期顺序和其他未接modifier仍是适配，不称整套modifier或全关1:1。

渲染新gnollAuraSprites/drawGnollAuras纯读World：base/ring两个原z1400图，原aura_apply_mod.insert只给sprite1加source.unit.mod_offset(0,40)，ring仍原pos；ring alpha102→173→20和scale.65→1.57各自按原1秒loop线性采样，目标creepFx在脚下且不加mod_offset。三图同actorqueue，source视图offset不影响sort_y。extract_gnoll_boss扩三声明，body231+三静态=234帧/2,571,592B，原go_stage06/go_decals声明和PNG逐RGBA/size/trim验证，旧towercompact1314帧2,122,316B不变；只有level6加载该组。只-bl审计原game_scripts11333–11355、all/scripts3705–3862/4263–4300/4928–4966、systems542–627/939–1104及模板注册FNEW，controllers未执行。

566Node全过（8新aura）。actualbuild aura-browser-repeat从真实Space开波后受控原路boss+原reaver，经World.step自动aura→queued mod，真实50→75HP/maxHP、原5点近战实际8伤、持续刷新不叠/离圈撤销→maxHP50 factor1；Canvas三原图q/alpha/scale/矩阵/z与draw完整快照不变、真实pause/zoom/844x390 CDP touch/退图清理通过。active/combat/mobile截图人工看过，受控第6fixture非天然通关/同输入pixelcert。首Canvas fixture硬套.5而现原worldRules.textureScale=.84210526315789，改正确源值后过；一次完整World双tick合法AI消费RNG使不应成立的seed不变断言失败，移除该错误整World假设，独立aura纯测仍验证无RNG。首boss回归将整个扩展新图包都计为boss body致3!=1，改仅原body数字帧筛选后完整回归通过，没改产品。

囚车/相机/父level06结局仍欠，第6保守胜利门不变，入口继续关闭。正式仍前五关15模式；本批不以完成光环称第6或18模式完成。

0.2.133实际接通第6首领eb_gnoll基础战斗：独立原231帧/2,564,584B无损图包仅level6加载，原HP四档/armor.6/speed30。开场37帧scream第8帧真实赋megaSpawner.manualWave，后续原节点85/135/180轮换四组；普通近战按原chance1、>=1.5秒冷却/4帧dodge/22帧命中/70–90整数物理伤害。strict7秒（最高难度5秒）后的75帧踩踏第55帧对合法soldier组件目标按hero100–120/普通150–180（最高难度1000）伤害，保留physical|NO_DODGE，不误当穿甲。hurtDefender新增仅该caller启用的physical-mask选项，旧目标/旧模式调用不改。

死亡中断spawner并无奖励清场，原34帧death/death-complete与100秒不透明尸体保留；不以World.hurt给清场敌人发金币/XP或carrier落兵。原gnoll_boss_aura/mod_gnoll_boss增益尚未接；源屏幕震动/音频播放、完整native队列/IDs/时序/死亡实体枚举仍欠或适配。囚车/相机/父level06结束还未实现，因此campaign6保守胜利门保持，不开第6入口。浏览器为原路120,459附近受控spawn，不冒天然完整第6通关；当前正式仍前五关15模式。

0.2.132优先修复人类新反馈“援军攻击音效不会停止并重叠”。真实Campaign.sound/World.cast援军近战复现：6秒后援军均已死亡，仍3个melee.ogg声道并播，每轨约8秒，loop=false；不是无限loop标志，而是误用长TowerBarracksBasic音轨且每次近战新建Audio。原APK extra.lua的MeleeSword为五个Sound_SoldiersFighting-01..05短音0.42–0.92秒，sequence/gain.2/ignore.45，settings.lua SWORDS.max_sources=1；sound_db605–673原抑制与满组evict旧voice职责已只读-bl核对。

新melee-audio.mjs按原sequence轮换、450ms忽略窗、单SWORDS声道，新播放先pause旧轨，不积压/不用timer、不消费World随机或改命中/攻击cd。仅当前melee事件接入该组，其他音效组并非完整原sound_db恢复。dialog暂停/静音或音效音量0/transition换场景都即时停止并解绑旧回调；ended/error/拒播只清自己的引用，迟到旧回调不能清新voice。原五ogg从APK字节原样复制，不裁切/变速/重编码。source tools/sources/melee-audio.json固定extra/settings/sound_db SHA和五音轨SHA；extract_melee_audio.py接extract_campaign。旧长melee.ogg保留文件兼容，但当前近战不再调用它。

修前实际Chromium多援军调用峰值3，修后峰值1且仅melee-1/2等短音，援军死亡后无遗留声；pause/mute/map清理及无延迟重播通过，未用假Audio替代实际解码/播放，仅记录真实媒体事件。tests/melee-audio.test新增4项覆盖450ms/单声道/原顺序/回调竞态与音量。人类新反馈优先，所以本轮第6boss只保留源码审计与231帧原RGBA提取草稿到workdir/gnoll-boss-draft-0132，未当作已实现或发布进运行目录；下一轮继续接其真实战斗链，不取消原4–6目标。第6入口继续closed，前五关15模式不变。

本轮最终551Node全部过，actualbuild1640files91762132B、oldcompact1314frames2122316B不变。melee-audio-final-browser含真实手机触摸暂停正常exit0；desktop-options、连续新档1–4再第五三模式（4campaign19命三星/heroic142/iron95；5campaign20命/heroic201/iron147/XP37600）、原天然九模式/存档手机、UI与公开.131UI全部正常exit0。真实冷100ms/1.5MBps/cacheoff旧14809877B/232req、第四14767250B/222req、第五14950553B/233req（book7.814s/总17.477s）均<15MB，不保所有线路。第6预算本轮未重测，最近.131隔离15179814B仍未过、首领/囚车链未接；不可称18模式。最终pin重提和全部运行模块/五音轨逐字节等build，无浏览器挂住或未处理失败；baseline故意红的旧叠音记录保留。主要logs artifacts/melee-audio-before/after/final-browser/tests/build/options/natural4/natural5/old-nine/ui/performance/stage4-performance/stage5-performance/pages-ui/source-final.log，melee-audio-comparison.json保留真实前后媒体记录。

0.2.131闭合第6关mega_spawner的原四组手动召唤队列。level06.load指定level06_spawner，声明只含campaign Boss_Path_1..4（29/27/13/20单位）；heroic/iron为空。新stage6-spawner.mjs按原非sequence、非force_all分支先table.random分配数量，再逐点随机支路/累计interval/variation（即使单点与0范围也消费原随机），按时间排序，延迟到期queue、下一模拟tick调用真实World.spawn。四组支路与原敌模板/伤害/奖励/动画沿现有World链，不伪造额外金币或静态援军。manualWave同名不重放，换名先丢未提交未来项并yield一tick，interrupt移除controller但不撤销已queue的insert。原CUSTOM/PACK/raise不在该关声明内，未假实现通用mega_spawner。原Lua pairs/同时间排序、path_start与native队列职责仍以当前World适配，不称同seed逐帧一致。

ExpansionRepository仅level6按需读expansion/stage6-spawner.json，不全局import大声明，不加新图片。tools/extract_stage6_spawner.py先字节码断言数据chunk只有表构造（无CALL/FNEW/GGET/UGET）才读声明；控制器只-bl审计all/scripts5785–5804/5806–6016和level06，固定五源SHA、完整schedule记录sourceproof并接extract_campaign。普通数值wave不触发手动Boss_Path表，真实boss吼叫调用尚未接；actualbrowser显式manualWave是替代未来boss调用者的受控fixture，不冒称自然boss已出现。

第6campaign现已阻止普通15波清空提前won，直到真实囚车/首领死亡结局接通再由完整controller收尾；当前是保守关闭门，不是假的两秒胜利。cart/camera/eb_gnoll吼叫、攻击、aura与死亡结局仍欠，第6入口继续关闭；正式范围前五关15模式不变。至少7新纯测覆盖4组数量/RNG顺序/nexttick真实插入与奖励/同名换名/interrupt/暂停隔离/真实移动/防提前胜利。actualCanvas受控队列生成后真实敌移动、HP伤害/源图q-alpha/已decode/draw不改World、pause/zoom/手机触摸/地图清理通过。首browser仅模拟8秒，仍有1个原随机延迟项未到；改15秒受控观察窗后通过，产品delay与seed未改。后续自然模式/性能最终结果见发布日志。

0.2.131最终547Node全部通过；actualbuild1633files91648850B，oldcompact1314frames2122316B不变。spawner-browser-repeat、fixed-regression、new-save自然1–4→5三模式、old-nine、UI、公开.130UI全部正常exit0。自然第四19命三星/heroic142/iron95，第五20命/heroic201/iron147/XP37600；无产品值/金币/成长/RNG修改。旧冷14,809,333B/230req，第4真实旗书14,766,706B/220req，第5真实旗书14,950,009B/231req（book7.902s/总17.675s）全部<15MB。第6隔离冷15,179,814B明确assert失败exit1，未放宽门槛或降质，不称第6验收通过。仅level6下载新增原schedule JSON，没有新增图片。源module与schedule逐字节等实际build，最终重提pin校验成功；logs artifacts/spawner-tests/build/source-final/browser-repeat/fixed-regression/natural4/natural5/old-nine/ui/performance/stage4-performance/stage5-performance/stage6-budget/pages-ui.log。独立额外localUI也正常exit0，早期8秒观察窗失败日志保留。

0.2.130实际接入第6关固定Alleria射手与猫。原level06.update在任何mode开波前创建hero_alleria_fixed于(660,625)，cat_pos(640,655)；不是第五关可选玩家第二英雄。原HP210/health.ignore_damage/F_ALL/UI不可点选，模板血条初始隐藏、完整update在入场后设为显示，独立World.fixedAlleria，不进stageHeroes、多头像、普通援军寿命或敌人target列表，不借主英雄XP。重要修正：初仅看模板误判无血条，原game_scripts8182在respawn后明确health_bar.hidden=false，systems.render依此显示；最终按完整源恢复入场后的世界血条，不增加可选HUD。原24帧respawn后排队猫，下一模拟tick创建，猫继承父sprite z3001而非默认3000，固定位置不走第五关NF_RALLY网格求点；原全局pos(nil)不伪填nav_rally字段。猫不制造伤害，idle_flip和真实音频播放仍欠。

fixed-alleria.mjs/fixed-alleria-data.mjs独立行为：原区域union ellipse(838,491,r125,k1.368)/(540,357,r75,k1)，600范围/min0，U.attack_order等chance时大cooldown先，special7秒优先、普通1秒，chance1照常draw。原普通11/30、special13/30前摇，原两弹10–30物理/22帧g-900/无prediction_error轴误差，特殊3clone+原箭共四箭；复用已经审计的Alleria抛物线/strict22接触伤害与每tick切线，非torch/DOT，不加NPC XP。普通soldier辅助原优先飞行/foremost职责以当前route模型适配，完整native节点预测/跨路径排序、queue/coroutine/IDs仍非同输入恢复。前摇stun取消不重置成功时钟；已发弹独立，收尾stun按源结束动画等待并提交开始时刻；max_track128拒发不提交成功cd。固定外层绕过普通可移动英雄的近战/regen/死亡返生职责，未伪造可选/集结/右头像。

tools/extract_fixed_alleria.py只读-bl审计原game_scripts8171–8180/8182–8279/8284–8302/8307–8371、level06 48–151、SU1084–1248、utils794–857与原templates，生成声明/记录七源SHA及scope；不执行controller。扩展catalog仅level6合并fixed模板、按需加载现有Alleria237帧328080B图包（不是没有下载：第6此前未用该包，现在多载既有文件；没有新增图片文件/裁图/改RGBA）。旧五关图包不增加，oldcompact仍1314frames2122316B。group_expansion重提更新第五运行模块SHA，原4/5/6组帧值和图片字节不变。完整extract_campaign已接新审计。

540Node全部过。实际build1630files91,643,952B；最终fixed-browser-final-release通过（含源血条fillRect与箭旋转矩阵）真实Space开波后的受控第6World.spawn/step自动普通/四箭、真实10–30伤害/NPC免伤、不写主英雄XP、cat/body原Canvas q/alpha、箭旋转矩阵与draw完整World快照不变、pause/zoom/844x390CDP触摸/地图清理。shoot/special/mobile截图人工看过；这是受控位置/时钟的局部机制验收，不是第6天然通关或原版同输入像素验收。初browser只在road0找目标，落在原攻击区域外，正确没有射箭；fixture改为所有原道路最近节点并同步d后过，产品区域/伤害未改迁就测试。

第五Alleria与第6upper守卫实际Canvas回归、连续新档1–4→第五自然三模式（campaign20命/heroic201/iron147、末XP37600）、原完整天然九模式/存档手机、UI全部正常exit0。最终第五真实旗书入口14,946,769B/230req、book7.847秒/总17.461秒（100ms/1.5MBps/cacheoff）仍<15MB；旧冷14,806,331B/229req、第四14,763,710B/219req也通过，最后仅新第6已选目标死亡释放与源世界血条职责补充，不改变旧五关模拟或图组。

**第6自身冷门仍失败，入口继续关闭！** 新test:stage6-resources完整title/save/map/book后隔离level6，15,176,267B/218req、book6.455秒/总16.371秒，15MB assert明确exit1，不放宽门槛、不降质/假延后当前必需图。无missing/实际调用但未decode的sprite、baseCatalog/progress/drawWorld不变；仍是隔离入口，不是发布第6旗书路径。未来首领等资源还会增加，不能把当前五关预算通过当第6通过。下一步必须转mega_spawner/load_file level06_spawner/囚车→eb_gnoll首领结局连续链；当前普通15波won不代表完整6，不继续磨同NPC/旧HUD。公开一次manifest .129与完整fixed-pages-ui正常exit0，新推送不循环等CI。主要logs artifacts/fixed-tests-final-publish/build-final-publish/browser-final-release/alleria-regression/guards-regression/natural/old-nine/ui/performance/stage4-performance/stage5-final-release/stage6-final-release/pages-ui.log。

0.2.129将第5关「皇家庭园」接入真实发布链（原APK中文名是园，先前任务描述称院）。当前cap5，前五关共15模式，第6关仍关闭。prepare_stage4_release.py保留既有入口名、改为生成4/5原三模式索引，Repository按需加载扩展并传独立assetCatalog；原第4胜利旧存档只迁移开放5、不赠第五星/挑战/XP，地图只揭示一次。第五原旗(344,790)、七道路点来自固定map_points SHA；原stage_thumbs_0005为342x246、screen_map-3.png quad(7,1489,342,246)，原RGBA无损裁图。source proof在tools/sources/stage5-release.json，原声明/PNG SHA和extractors可重建，不执行controller。

本批没有修改怪物/英雄HP、金币、伤害、回血、XP、冷却、路径终点或World随机流。前次挑战测试玩家频繁追到出口外侧、移动取消攻击；合法改为两英雄分路站位、分散一级塔后按预算升级，英雄挑战末段用真实剩余金币升级Arcane和购买爆裂/睡眠，避免预算闲置。tests/stage5-strategy.mjs只调用真实purchase/move/cast/plant/upgradeTowerPower/World.step。先在tests/stage4-natural.mjs从新档真实赚到XP18139，再连续第五campaign20命零漏怪/805kill815spawn→heroic201kill204spawn→iron147/147全过；10/3台投石车正常退场不算漏怪或击杀。连续最终XP37600，recordVictory真实落盘第五三星/双挑战且cap停5，未伪造解锁或预设高XP。

实际浏览器从本轮新档连续1–4的真实earned存档续打第五三模式，完整旗/书/奖励与手机重载通过。测试按计划预解码将购买的塔图以加速模拟，真实生产冷入口另测；不冒称同输入原版像素验收。初两套较弱浏览器计划在英雄挑战199/184杀后失败，日志保留，后续合法追加塔/技能预算通过，没有改产品数值。一次三模式已全部获胜后重载检查失败，原因是测试addInitScript在每次reload覆盖存档，修为只导入真实earned存档一次，产品持久化未改以迁就fixture。补原通知后的最终浏览器三模式又全通过，末XP38903，骚扰者与Blade发现标记/第五星及挑战手机重载保持。

还实修了源通知接入遗漏：原4/5第一波分别TOWER_ARCHER_ARCANE/TOWER_BARRACK_BLADE，旧代码只接TOWER_LEVEL2/3。现在仅接受已有真实layout的TOWER通知，原always/seen/单局一次职责保持，原照片/文案/发现标记入账；骚扰者原enemy通知、百科裁图与中文也已接。投石车原notification表无条目，不伪造。百科支持已实现新敌/Arcane/Blade的原模板统计，首次重载可用，不要求先入关合并模板；仍按always/seen门显示。新增书用声明不当成旧战斗依赖，optimizer排除campaign-release模块，原oldcompact仍1314frames2122316B。

第五真实旗→书→战斗冷入口（非隔离注入）初最终包实测14,937,687B/228请求，book7.878秒/总17.572秒，100ms/1.5MBps/cacheoff且无missing；补原通知后最终数字见本批末尾日志。保持15MB门、不整atlas/OTF/抬预算/降质，不承诺所有线路速度。530Node全过；本批图框专项实际覆盖两高级塔通知与骚扰者。手机/地图书页/奖励截图已人工看。第6仍缺Alleria_fixed/cat、mega_spawner/load_file、末2秒curtains→囚车→83/30→eb_gnoll首领链，普通15波won不算完整6。动态grid/native协程/完整IDs/globalz/所有modifier与特殊death/音频等仍是适配边界，整体非1:1。

最终actualbuild1628files91,634,549B；fifth-tests-release530全过，fifth-browser-publish三模式/真实奖励存档与手机重载、fifth-presentation-publish历史第四胜利迁移一次/原第五书页/手机入关、fifth-notifications原照片四角、fifth-old-nine-publish原天然九模式/存档手机、fifth-ui-publish与三个实际冷入口均正常exit0，无挂住待收。最终旧冷14,796,984B/227req、book7.167秒/总16.777秒；第四14,754,363B/217req、book7.198秒/总16.859秒；第五14,937,666B/228req、book7.867秒/总17.573秒，网络100ms/1.5MBps/cacheoff，无整atlas/OTF。原UI622图，新增图严格原PNG exact=True roundtrip，旧编码保持。全量extract_campaign已将新stage声明提取提前到UI/书用索引依赖之前，避免靠旧生成文件重建；最终web运行模块/新UI与书页逐字节等于build。公开一次manifest确认.128且fifth-pages-ui正常exit0，新推送后不循环轮询。

0.2.128第五关隔离冷入口首次通过15MB门：完整桌面双英雄HUD、真实预建二级兵营、投石车与Alleria/猫依赖均保留，100ms/1.5MBps/cacheoff实测14,833,565B/225请求，book6.504秒/总16.468秒；比.127的15,537,493B少703,928B。此为真实title/save/map/book之后的隔离level5入口，不是已发布的旗5/书5路径；生产仍前四关12模式，第5/6关闭。未抬预算、降质、清透明RGB或漏载当前会绘制的图。

tools/group_towers.py新增entry变体，仍完整保留原1314帧，common514帧725580B，四族一级分别21/56/97/172帧、21746/54932/84994/180148B，二三级依赖按族取用。只stage>=5使用；预建兵营按实体依赖在入关前decode，空地菜单按实际allowed四族在打开前decode，继续沿用owner/scene/slot/version/current守卫、取消不回填、失败可重试和交易前不扣费。原1–4图组与旧compact1314帧2122316B不变。所有帧完整RGBA（含alpha0 RGB）/size/trim逐项校验。

第五关场景依赖改从真实render.sprites的prefix/name及当前玩法声明闭包选取，避免把普通组件字符串aura误当动画前缀而载入Faustus等无关英雄贴花。stage05由2057帧3600394B变1815帧3175904B；保留逻辑动画别名、鹿/魔法花与实际通用战斗效果，记录runtime roots/模块SHA，保留帧与旧组逐RGBA/size/trim比较相同。stage04/06输出字节保持。新test:stage5-resources同时拒绝metadata存在但sheet未decode的实际sprite调用；test:stage5-entry-assets验证真实四族1→2→3/Arcane/Blade、空地延迟取消、预建兵营升三级网络失败不扣费再重试、暂停/缩放/手机/清理。

本批自然策略探针没有改玩法数值、HP/金币/伤害/冷却/seed或伪造解锁：从实际第四关连续通关的XP18139和已赚星开始，经合法训练/天赋API，第五campaign计划0可20命零漏怪获胜（805kill、815实际spawn，十台投石车正常退出不算漏怪），结束XP30464。另三计划18/16/20命。用这次实际earned XP继续训练后，八个合法计划的heroic仍在第二波失败，iron也未通过（最佳100kill仍漏一只）。因此这些是隔离策略证据，不是自然三模式验收，也没有把cap4的recordVictory改成虚假第五奖励。失败日志entry-natural-probe/entry-challenge-probe保留；下一步必须诊断挑战的合法策略/源机制差异并完成真实发布链，不能把本次预算通过当第五已开放。

最终526Node全过，actualbuild1622files91,382,485B；新第五资源/真实菜单专项、刀舞/投石车/三场景真实Canvas回归、天然原九模式/存档手机、连续第4三模式（19命三星/142/95）、UI、旧与第四生产旗书冷入口全部正常exit0。旧冷14,754,136B/227请求、book7.166秒/总16.775秒；第四真实旗书14,711,518B/217请求、book7.176秒/总16.872秒。第五14,833,565B隔离入口的预算余量不代表未来真实书页发布也通过，发布链仍须重验。最终运行模块与变更图组逐字节等于build。logs artifacts/entry-tests-final/build/browser/stage5-budget/dance-regression/catapult-regression/scenes-regression/old-nine/stage4-natural/ui/performance/stage4-performance.log。首次公开manifest误用了不存在的manifest.json收404，随后正确build-manifest.json确认.127；没有修改产品绕过该路径错误。

0.2.127刀舞三档购买与原战斗流程已接通：每档250、max3，hits2/3/4、damage25–35/35–47/40–56、strict9秒检查，至少两个合法目标才开始；不足时原delay_attack延后6帧且不抽chance。原dance_out后，每击重新按当前位置/125椭圆/原vis及当前有效路径节点筛选，排除已访对象；无候选但visited非空时清表再查，按zmod(i,#targets)选中，目标计数stun_inc→原slot1/heading朝向瞬移→三个dance_hit1/2/3随机动画之一→5/30后ceil(frandom)真伤→等完整动画后仅释放本次stun。完成回原施法位置dance_in，再还原原vis.bans与ignore_damage。利刃大师不追加mixed文本的刀舞伤害。

新web/blade-dance.mjs及原proto只读生成blade-dance-data.mjs；read_blade_dance.lua仅loadfile+jit.util.funck读取原1709函数TDUP，连controller顶层chunk也不调用，三动画名由原常量表取得。extract_blade.py补1820闭包/原utils714–738及719–731、melee_slot_position984–1008、SU159–178计数与276–279重试审计，controllers不执行。独立bladeDanceStunCount与睡眠箭arcaneStunCount/外部stunned并存，ignore_stun不计数，死亡/目标移除/塔出售清自己token；没有抹掉其他眩晕。新player rally请求在刀舞结束、回到起点后才消费；已经开始的动画/前摇不因stun或新集结命令中止。技能期间原health.ignore_damage确实忽略伤害，结束恢复，不是全局Blade免伤。

三个技能的基础玩法现均可真实购买，但仍非完整原塔/整关1:1：native协程与queued damage/insertIDs、动态grid/nav节点、部分音效/升级flash/特殊death与全modifier链未恢复。目标节点与朝向由当前World路程/heading适配，不冒称原native同输入全状态；原F_ALL针对新目标获取，已有投射物/伤害在本类的明确ignore_damage阶段处理。原142帧301774B包与oldcompact1314帧2122316B完全保持。第5资源门与自然三模式未通过前不开入口，第6仍有首领结局缺口。

0.2.126新增剑咏者「利刃大师」真实300金币单档购买，上限取tower_blade.powers.swirling.max_level=1而非soldier模板的3。记入spent/原退款，三兵各自克隆原melee并按SU.soldier_power_upgrade对三种power_name=swirling攻击应用damage_inc5/cooldown_inc-.2：15–19物理整数伤害、各冷却.8秒、forced_cooldown取最小值.8；不改变原攻击概率/顺序、命中时间或动画，不重置攻击时钟/消费额外RNG。普通攻击/反击等待结束后的outer loop才观察购买；补兵在insert继承已购等级。模板与其他单位不写回。塔信息栏按原tower_barrack.get_info临时创建并升级的职责显示15–19，不等已有兵观察才变，也不修改百科的原始无技能数据。

原APK scripts1711–1750/get_info与SU2174–2280完整只读-bl核对，extract_blade.py新增审计字段与原300/单档/三攻击声明断言，controllers不执行。完美闪避counter仍为固定3 true伤害，未套mixed附加damage_inc；刀舞仍禁用。原142帧301774B独立Blade包与旧1314帧2122316B compact均未新增或改RGBA。第五自身预算/自然三模式与完整路径等仍待验，第5/6入口保持关闭，不称整体1:1或18模式已完成。

0.2.125新增剑咏者「完美闪避」实际三档购买：每档175金币、上限3，记入spent/退款；刀舞与利刃大师仍禁用。原tower_barrack传播等级、soldier_power_upgrade每档chance_inc .1，新补兵继承已购等级，模板不写回。普通unit_dodges与health.on_damage是两次独立源检查；后者先排除死亡/stun/刀舞、非物理魔法类型及NO_DODGE，成功仅拒本次伤害并置active。原SU.y_soldier_do_single_melee_attack的前摇与收尾等待均检查dodge.active，非silent时中止该等待，下一outer tick进入反击；已经提交的命中不撤回，未提交的命中不伪造，stun可推迟开始，已进入的原等待/循环不被stun中断。

原game_scripts1709–1884反击从开始计两秒，health.ignore_damage在这段期间忽略各类伤害；5/30秒前摇后，strict time-ca.ts>5/30每模拟tick最多一次，对50/.7椭圆内合法目标固定3点true伤害，不抽伤害随机、不随技能等级增加反击伤害。原APK没有mixed文本额外的damage_inc*swirling，未照抄。开始OR F_NET、结束仅清F_NET保留其他ban；原perfect_parry动画按loop播放，绘制只读World。反击结束恢复普通受伤与移动，不给所有Blade或所有hurt全局免伤。完整native队列/协程同输入、特殊死亡、音效和通用modifier枚举仍是适配边界。

源证据扩展tools/extract_blade.py：原on_damage1673–1691、update1709–1884、SU.unit_dodges138–157、soldier_power_upgrade2174–2280、systems.health939–1104只读-bl审计；read_blade_parry_rules.lua只读声明常量，controllers不执行。142帧301774B独立组和旧compact1314帧2122316B均未变化，未新增图或降低质量。当前仍仅前四关12模式正式开放，第五自身预算/自然三模式与其余机制尚未验收，不把受控技能专项当新关通关或原版同输入像素认证。

人类要求从2026-11-05起优先继续后面三关。0.2.119发布范围为前四关、每关三模式。第4关已接真实地图旗/道路、原书页、胜利奖励与存档上限4；第5、6关仍隔离开发且入口关闭，不把它们的普通波次结束当完整通关。

`tools/extract_expansion.py --apk ../origins.apk`读取原APK的九份波次、三份路径/实体声明、模式限制与依赖模板；`tools/sources/expansion.json`固定所选源文件SHA。仅读声明，控制器未执行；模板reader沿用原脚本stub边界。三张背景及选中精灵图无损输出并逐解码RGBA校验，所有别名保留size/trim，3566个帧键共用紧凑图。

| 关卡 | 模式 | 初始金币 | 波数 | 声明生成数 |
|---|---|---:|---:|---:|
| 4 红杉阻击战 | campaign | 500 | 14 | 491 |
| 4 红杉阻击战 | heroic | 500 | 6 | 142 |
| 4 红杉阻击战 | iron | 480 | 1 | 95 |
| 5 皇家庭院 | campaign | 400 | 15 | 740 |
| 5 皇家庭院 | heroic | 520 | 6 | 201 |
| 5 皇家庭院 | iron | 650 | 1 | 147 |
| 6 狮鹫驿站 | campaign | 600 | 15 | 650 |
| 6 狮鹫驿站 | heroic | 620 | 6 | 118 |
| 6 狮鹫驿站 | iron | 520 | 1 | 169 |

此表生成数仅指波次spawns.max之和，不包括后续原载兵释放等脚本生成。`ExpansionRepository`合并到隔离目录，未改变当前Repository/catalog/进度；目前用于实际Renderer资源预览和后续机制实现。可重复专项`npm run test:expansion`不经过伪造存档解锁，明确不代表完整通关。

0.2.101已接入双头食人魔基础回血、自击/自停顿、恢复走路/近战和普通尸体保留；对应隔离机制专项通过，新关入口仍关闭。扩展catalog的pendingMechanics为首次导入时的清单，当前进展以本文件为准。

0.2.102已接入载兵鹿角鹰主动/普通死亡释放、同路径节点继承、源位置入场连接段、三精灵显示与防重复/延迟胜利判断。对应控制样本通过，完整新关入口仍关闭。

接下来必须闭合：

- 第4关：新敌人完整特殊死亡/音效及通用modifier生产链、奥术塔剩余粒子/音效与本关分组预算、完整自然战斗验收；树屋和5/10波焚林已接通。
- 第5关：预建兵营、hero_alleria与投石车原事件、本关允许的其他高级塔；骚扰者远程/后跳影袭基础分支已接通。
- 第6关：Alleria/猫、mega_spawner/囚车首领结局与其他高级塔；狮鹫上下守卫和援助已接通。
- 新敌人通知/信息栏/特殊死亡、真实地图4–6旗与路径/奖励链、存档上限扩展；待玩法验收后一起开放。

不加金币、削敌或改伤害/冷却以迁就测试。World当前部分通用行为能承载数据不代表新敌特殊机制已实现。前三关旧九模式必须持续回归。新关资源按需隔离，不进入旧冷启动15MB关键路径；后续启用时需另测各新关实际资源预算。

0.2.103先闭合枯萎者封花分支：原五秒检查/175椭圆/.5秒施法、被stun打断、attackPlants期间停位且不另起近战；原mod图面/alpha tween/4.9秒禁用、解封重启植物原蓄能。以植物对象引用绑定目标，不混用敌人数字ID；独立于施法者死亡，暂停冻结。源通用mod_lifecycle拒绝同级重复，运行中的等待/tween不重启。完整植物原加载/ready/独立FX通知尚未全接，当前模拟协程插入量化不称同输入一致。

本批没有完成能量弹，World旧enemy ranged共用launchTorch仍不适合blighter；新关继续隔离，下一批必须优先实现该原追踪加速弹与energy前摇/停步，不可据封花完成称枯萎者全部完成。第4–6入口仍未开放。

0.2.104接入枯萎者专用energy远程episode与追踪加速弹：hold_advance停步、实际出生时开始首次ranged cooldown、原energy动画/.6666667释放/完整动画结束；原发射偏移按朝向镜像，初始目标含hit_offset，飞行追踪改用目标中心。弹体每模拟tick按源ceil规则加速60→240，接触前先用旧目标点/旧速度判断，死亡或F_RANGED ban丢失追踪后仍飞到末点；自己的三帧hitUpDown结束，不生成火把爆炸或burn。新敌专用分支，前三关旧enemy ranged保持。

这些是当前World调度器内的源机制适配，不称原完整协程/insertID/queued damage同帧一致。完整通用modifier生产链、专用插入音效、特殊死亡与全关脚本仍欠。第4树屋/高级塔、新关加载分组预算与地图/存档限制仍未完成，4–6不开放。

0.2.105接入树屋独立slot与原菜单：先100金币修复，再每100金币雇佣一名小熊，上限四名（包括尚未清理的普通尸体），不是100金币送四兵。每次首开门动画结束后才扣费/生成一兵，原集结点/单兵中心与按实际人数椭圆重排；普通死亡3秒清理，不自动补兵、不允许出售修复屋。新类接现有普通战斗适配，按原HP100/速度75/近战3–7与投矛16–20/11帧出手/22帧flight_time。盾挡控制器、完整原投矛轨迹与特殊死亡尚未完成，不称完整小熊已还原；第4–6继续未开放。

0.2.106补小熊盾挡：完整原函数值can_dodge未进入JSON，APK game_templates14032–14035确证先记录last_hit_ts，再仅hp<=hp_max*.5返回true；不是“20秒后四秒全局无敌”。原unit_dodges先做stun/ranged/strict>cooldown/NO_DODGE门，再消费chance随机，最后调用半血函数；即使chance1也消费一次。新类接源近战dodge_time与普通torch arrow命中调用，其他旧目标不新增RNG；专用blighter energy和已附burn不走unit_dodges，仍伤HP。

原盾挡start前计四秒、11帧start/10帧hit/5帧end，结束动画后才重置20秒冷却；等待期间取消自己的未释放攻击、停位但保持现有近战阻挡，hold里调用原离散regen，回血超过半血后即使尚在shield动画也不再成功躲攻击。函数值回调即使拒绝仍可记录hit反应；每次攻击仅检查一次，不按RAF抽随机。源start/hit/end等待与当前World调度适配，完整协程/queued damage/native IDs、特殊死亡/全modifier生产链仍不称完全同帧。完整投矛预测/抛物线仍待接，第4–6未开放。

0.2.107补小熊专用投矛：从原scripts.arrow发射时固定target.pos+hit_offset+motion.speed*flight_time，g=-900/flight22帧抛物线，逐模拟tick实际位移朝向，严格距离<22才一次ceil(frandom16,20)命中；原hide_radius6沿现原图队列保留。前摇目标移动超过原attack.max_track_distance128不发射，弹体模板max_track_distance64不是这条controller里随意添加的homing限距。旧sin/chord分支只从小熊弹移除，旧前三关箭不改。当前新关motionVelocity从World模拟tick实际位移计算（非渲染差分），原native motion/controller时序、完整ranged目标挑选/随机episode、血花/特效字/水面miss、未来harasser dodge仍未全接。此批闭合弹体轨迹/接触，不称完整小熊或新关已验收，4–6继续未开放。

0.2.108先闭合第5关暮光骚扰者远程分支：出生开始的严格>10秒冷却、最近合法目标/短暂F_CUSTOM标记、原shoot_start10帧→四次shoot_loop5帧（每次3帧出箭）→shoot_end11帧。完整原loop controller没有读取repeat_cooldown字段，未凭模板额外加20帧等待。每箭原随机flight_time_range(.5..26/30)，固定当次目标+hit_offset、g=-900抛物线/逐tick朝向/strict22接触/ceil(frandom20,30)真实伤害，不走旧torch或附burn。stun在loop转收招、start等待与end等待按源职责；已发箭独立。原mod_twilight_elf_harasser是动态脚本引用，初扩展闭包缺此声明，本批独立只读提取到harasser-data并恢复target bans原位，而非虚构有图的debuff。后跳闪避/节点/地形门和shadow shot尚未做，不称完整骚扰者或第5关完成；4–6继续未开放。

0.2.109接入骚扰者近战闪避、后退节点跳跃和影袭反击：源strict7秒（dodge.ts默认0，不随出生重置）、stun/magic/NO_DODGE与ranged=false门，近战实际调用先抽chance，再由controller抽-18..-10节点/重置cooldown；源path visible/end边界与lane1中心点Faerie校验。原grid_db ceil/clamp、16格和三关初始grid已只读核对，当前4–6中心路径无Faerie点，仍保留真实拒绝门（动态地形生产链未做）。jumpOut14帧后才换原lane节点，再jumpIn14帧、恢复vis bans/解除已知modifier显示隐藏，shadow_shot14帧出25–35普通箭。不是全局hurt免伤：仅当前塔/兵/英雄新目标选择避开jump bans，已发/直接伤害仍按现路径，技能AoE目标链与完整native调度尚未全部恢复。World传入原viewportAspect边界计算，未传默认4:3；非零safearea/动态path mutation/完整modifier-auras仍是边界。新4–6仍未开放。

0.2.110接入第6关两名上层狮鹫守卫的连续射击流程：原实体位置(460,640)/(450,700)、原z3001/anchor/15帧shoot、两片原椭圆区域过滤、每名独立aura随机冷却20/30..35/30并等待cooldown+1/30再刷新；原7/30前摇、chance1仍消耗一次随机。箭弹固定flight12/30/g-900、源移动轴独立prediction_error（x正0..10/y负0..10）、逐模拟tick切线/端点hide6、strict22接触/10物理伤害，未误用火把或预抽伤害。优先级以当前route.d换算源剩余节点，原native路径/协程/queue/ID顺序仍适配。

这两名原守卫health.hp_max=1/immune_to=ALL_TYPES/vis.bans=MELEE|RANGED/无health_bar；当前以World专属gryphonGuards集合维护，避免误走临时援军寿命、普通兵营复活或敌人近战选敌。它们未加入玩家可交互士兵/集结入口，也未伪造死亡补兵；完整通用modifier/auras/目标枚举生产链仍待接。下层守卫的探身/淡入/退回掩体、关卡狮鹫演出/脚本和高级塔尚未实现，不称整关或所有guard已恢复。隔离第6关真实World/Canvas流程与旧九模式回归验收，4–6入口仍关闭，新关自身资源预算/原全层级尚未验收。

0.2.111接入第6下层守卫的开波门/探身/退回流程：原hide(459,563)/show(440,550)、首次wave>=1才一次frandom1..3秒等待，rally请求后yield，按原speed75走到位后下一tick恢复攻击，闲置严格>5秒（自max(attack.ts,lastShow)算）禁用攻击/返回hide，再进入随机等待。原source探身nav_rally.center=this.show为nil，未虚构show_pos替代；当前仅rally.pos用于移动。原初始attack.disabled未设置，透明/首次等待不强加禁用，第一次退回才disabled、后续show到位清除。alpha独立按原0:0/.25:255/.5:255正放或duration-time倒放；不是移动到位瞬间出现/消失。lower独立两片原区域过滤、原1秒ranged冷却，复用已审计guard箭/真实伤害，不用upper随机冷却。

World实例维护lower phase/rally/tween时钟；Renderer guardPose只读原running/shoot与alpha覆盖，避免template初始alpha0再乘成永久透明。暂停冻结、场景丢弃清理，不改旧九模式/4TYPES/退款。新关原完整协程/tick顺序、通用modifier/vis/原集结链仍适配；第6狮鹫出场/互动/轰炸等脚本和高级塔/新关预算与旗路存档仍欠，4–6继续未开放。

0.2.112接入第6关狮鹫援助：原三模式两侧波次/延迟/重复cooldown（campaign5/17s左、10/13s右；heroic2/15s左、4/15s右；iron1/15s双侧），原Bezier初次飞行/常规飞行/approach曲线与duration、attack_start/loop/end区间每.1秒三弹、降落/idle、原body click_rect点击起飞再巡航。专用bolt按原speed300/距离<2*speed*dt在实际弹位置30椭圆魔法AOE，每目标一次ceilfrandom100..120，FX/弹坑在目标to，原fps10/anchor/z3400；initial_impulse字段按源消费随机但专用controller并不读取它，不假套force_motion。命中FX/原弹坑fade、两body3400/影3000 alpha60/flash3000、原sign缩放alpha与5秒隐藏1秒显示一起入actorqueue。

原level06.load的TDUP波次常量从未执行的loadfile编译函数prototype用jit.util只读取得；控制器top-level/load/update均未调用。只读-bl审计所有职责，声明与6条原4控制点曲线来自APK。当前原native协程/insert/伤害队列和完整modifier链仍适配；phase由World持有，pause冻结，场景丢弃清理。第6还有hero_alleria_fixed、level06_spawner/mega_spawner及campaign通关后囚车/eb_gnoll首领链未实现，本次源审计已明确发现，不能只凭15波结束就说第6关自然完成！新4–6入口继续关闭，原boss/高级塔/各新关预算/地图旗路与存档奖励未验收前不开放。

0.2.113闭合第4关campaign原焚林事件：APK门槛是第5波/第10波（不是第6波），纵火者770,-30以45速度走至680,105，8/30前摇→12/30火把→5/30等待后烧第一区；按原x排序和0.37/0.555/0.2分摊错峰处理树/火/焦痕，地表延迟.46后原.26秒淡掉，开放path3和24号holder（can_click/can_hover、z1199→Z_DECALS1400）。1秒后演出纵火者转成真实enemy_gnoll_burner，原road2/lane1最近node+3、enemy_basic再+1，由源位置步行连接原节点而非瞬移。第10波同排序烧第二区并开放path4，无第二名脚本纵火者。heroic/iron原load即打开path3/4，不执行campaign演出。

当前World独立stage4Burn/scenery状态、脚本建造门与nearestRoad active/invalid-node适配，绘制纯pose并保留每个声明的非均匀scale/r/z/anchor，不再用scale.x代替双轴。源控制器与全部声明只读审计，JSON不改；脚本火把目标是无health的decal，不进入普通敌人伤害/奖励。完整native协程/插入/renderer timed顺序、source grid/寻路生产与音频仍适配。

高级塔锁已真实审计：第4关原locked_towers只锁其余7种，tower_arcane没有锁，当前实现仍仅基础1–3tier，**奥术弓箭塔尚未完成**。这是第4关开放前的明确缺口，不能把这一名单导入当高级塔已实现，也不能以新敌/焚林专项过了就宣称第4自然完成。4–6入口仍关闭，后续需原高级塔/通知/资源分组预算和实际新关通关验收。

0.2.114接入奥术弓箭塔基础升级/普通攻击：真实archer1→2→3→tower_arcane，价格70/110/160/230，累计spent570，未另造第五种基础塔。高级分支读取原菜单action_arg；tower_silver等未实现分支与Arcane两种技能继续disabled。现有前三关各级锁按各关原rules保持（第3关已允许基础3级，锁的是高级塔，不能概括为前三关全部只允许2级）。原范围200、两名射手按.1秒错开动画/放箭、严格>.8秒冷却、4/30前摇、原射手offset与目标方向选择；箭按源距离决定flight、固定预测落点/非零速度轴误差、g=-900/逐模拟tick切线/strict22命中，11–18物理伤害后原mod减.03魔抗（raw值累计、显示值夹0..1）。射手/塔身/气泡/原命中FX同原actor队列；原get_info伤害按两箭显示。

只读APK模板/Arcane controller240–362及246–274闭包、普通arrow/mod_damage/health魔抗分支，固定SHA；原PNG所需266帧独立lazy组373,782B，逐RGBA/size/trim验证，旧前三关不加载该组，旧塔compact仍1314帧。9号肖像补源PNG无损裁取。模板仅合并ExpansionRepository隔离目录，没有开放新关或改旧存档。

当前只闭合基础双箭/魔抗削减，不包括爆裂/睡眠购买与技能、全部血花/特效字/水面miss、完整原modifier/native队列/协程/IDs。现有motionVelocity和目标优先级仍为World适配，未称Love同seed或原同输入帧。第4–6仍须其余脚本/高级塔技能/预算与真实新关全流程验收；第6Alleria/spawner/囚车首领链仍欠，不能15波后冒自然完成。

0.2.115闭合奥术塔爆裂箭三档原购买/普通箭payload连续分支：每级200/max3计入spent，首次level1变更被controller观察才重置12秒；若观察前连续升到2级，保留原special attack.ts=0，不丢时钟。原13/30 special单箭、两射手跨普通/特殊episode轮换，special释放range允许1.1倍；箭沿现原预测/抛物线，结束无论直接命中与否都queue aura，下一模拟tick执行一次level*80魔法AOE/r57.5/.7椭圆，允许飞行。伤害中心取仍存在目标当前位置（即使目标已死），移除后取预测点；爆炸画面仍在原预测to。原目标活且地面才生成两层1400地贴，source3300爆炸/offset-sort-7/14帧与原独立alpha/scale keys同actorqueue。末次直击杀敌时等待pending payload处理后才判胜，未把F_ALL当全局伤害免疫。

原power图/背景/三rank位置和原价、下一档tooltip/满级隐藏、花费退款已接。睡眠箭仍disabled；箭尾粒子、全部blood/pop/water miss、原音频/升级flash与完整native modifier/协程/队列仍未全，不称整个Arcane或第4关已1:1。新增图仅原2个地贴帧，Arcane独立包268帧377,542B，旧塔compact1314不变；605张UI中新增rank1/2和背景都从APK原PNG exact无损裁取。仍未开放4–6；应继续睡眠箭、各stage资源分组预算与原始新关全流程，不能停在局部专项或冒18模式完成。

0.2.116接入睡眠箭三级原购买（180/180/180）及原special施放，冷却24+level*(-4)=20/16/12秒，原F_STUN4194304/F_BOSS32选敌门；箭直接物理命中后才queue mod_arrow_arcane_slumber，下一tick按原mod_stun成功插入/计数并另外减.03魔抗。固定4秒、同级只重置modifier.ts（不重放动画/再计数/再减甲），高阶替换低阶/低阶拒绝；退出只清自己的计数，保留外部stunned适配状态，没有伤害免疫/受伤唤醒。已发箭独立，未提交近战/普通远程被中断、移动停止、冷却继续随模拟时间过去，原各新敌阶段的可中断/不可中断职责沿用已有controller适配；ettin ignore_stun回血、carrier普通stun落兵均接真实计数。

原两modifier sprite分别bubbles/z，跟unit.mod_offset、z3000/alpha255，首层继承目标flip，第二层按APK明确false（pATCHING FLIP日志也真实在原APK，不因mixed文本同名而猜为mod扩充）。原14帧slumber hitFX3300，复用原箭预测/抛物线/命中距离/actor队列；不改旧普通箭与旧九模式。原完整native队列/渲染时间边界/通用mod生产链/尾部粒子、血花/水面miss/音频等仍欠，不称全Arcane或全关像素验收。Arcane仍268帧377,542B，独立新关组无新增PNG依赖。

本轮核实指定视频真正新关part/CID并看过同关战斗125s：P11/CID1232866906第4、P14/CID1232877498第5、P17/CID1232900628第6。索引及帧SHA记tools/sources/stages-video.json，不猜P9；不同玩家输入/英雄进度，非同步像素验收。第5参考出现第二英雄，原level05.update51–98确证hero_alleria at40,190，同时原load/update有campaign10/heroic3条catapult_waves，动态enemy_catapult/duration/stop_ni，这些尚未接入。不能仅用初始实体/静态波次就称第5通关。新4–6入口继续关闭，接下来优先stage4资源分组/真实模式自然流程，再补其余关卡明确脚本缺口。

## 0.2.117 分关资源与第4关验收实测

`tools/group_expansion.py`从已审计扩展图与现有共享atlas生成stage04/05/06独立组，保留原size/trim/全部选中前缀与printf动态场景帧，逐裁图解码RGBA验证；每组记录输入catalog/atlas SHA。第4组1711帧3,802,488B、第5组1682帧3,188,742B、第6组2122帧4,140,874B，包含替代旧整张decals/stages下载的必要共享帧。旧7.3MB原扩展图保留兼容/重建，但运行时不再请求。共享同名帧严格RGBA比较未找到可直接复用项（透明像素RGB也算），没有为省流改透明RGB或降质。

ExpansionRepository仅取index+本关group+本模式数据，原base catalog/save仍只三关；Renderer仅对这些新关接受独立scenery preload列表，旧前三关不改变图面/路径。Phone BattlePortraits改为实际使用该profile时才加载，desktop不再启动时预载旧大头像/圆能力组；显式phone专项通过，H选择等待真实教程/通知关闭。

**第4关尚未通过发布门槛。** 完整desktop HUD的100ms/1.5MBps/cacheoff隔离冷入口测得16,006,890B/198请求，15MB断言明确失败；不能用先前未接desktop底栏的15,628,592B样本冒当前结果。测试从真实标题/存档/地图/书页后隔离进入4，不写存档解锁，生产入口继续关闭；最后仅补source SHA元数据，不改变帧/加载逻辑。旧前三关冷路径14,655,989B/213请求仍过。

新存档英雄连续打完前三战役自然XP5277后，以此同一入关成长状态分别试跑第4三模式，原预算/伤害/随机/波次不改：战役14波won但剩2命/漏13（514实际生成，含脚本与载兵），英雄挑战杀138/142后漏1失败，铁人95/95无漏怪won。它们是合法策略样本，不是三模式完整验收，也没有把XP直接写高或按原视频覆盖经济。一次改为跨第4三模式连续带XP的独立试跑反而铁人失败，日志保留，说明当前策略并非通用保证。还需诊断策略与未全接源机制，不能据战役won提前开放。

457Node通过，三关资源预览、焚林与睡眠箭真实Canvas/交易回归、原天然九模式/存档手机、UI与旧15MB通过。新关专项初缺3个printf场景帧已实修；后来fixture漏loadDesktopBattleTop import已修。手机截图第一次resize未等RAF有重复残像，等真实两RAF后截图已人工查看正常，没有改产品图层。公开.116 UI首轮断言完成后Node关闭挂住精确TERM143，独立repeat exit0，不把TERM轮称通过。完整global render/modifier、原音效/特殊死亡、新关通知/地图旗路奖励/save扩展等仍在后续门内。

最终补充输入SHA后build1543files85,167,327B，stage4-groups-three-scenes-release/UI-release正常exit0；最终budget-publish仍以16,006,890B明确exit1，未放宽15MB门。

## 0.2.118 升级图组就绪与第4关冷入口达标

`group_towers.py`复用原运行时塔帧选择器，将原1314帧按实际render动画索引（不能只匹配atlas物理prefix）分组；一级塔/建造/四预览及共享战斗图860帧1,071,438B首次解码，二三级各族454帧另组，原RGBA/size/trim逐帧核验，输入catalog/原两atlas SHA记录在catalog。原前三关仍用原1314帧2,122,316B compact，未更改数值/帧。高级Arcane原268帧图在实际三级弓塔升级菜单需要前加载，不在首次空地入口预载。

新关打开已有塔菜单前，`prepareTowerMenu`请求并等待对应图decode；期间菜单hidden/inert、不扣费，完成后按World/scene/version/slot对象/key/level/selected/modal与sceneMotion检查再开启原菜单动效。Escape/换场景使旧请求无效；失败清选择并显示真实错误，重开可重试。交易仍由原World方法同步检查预算/合法目标/退款，未因图片请求而暂停或改World时钟。预建塔在loadLevel内预取自身实际图组。Renderer.sheet合并在途请求，decode成功前不标记已加载。

逐图检查发现.117组只解析直接物理前缀，漏了logical动画名指向bambi/plant_magicBlosom的共享图，旧missing仅检查目录存在而漏报“有metadata但sheet未加载”。已实际补完整动画别名/索引依赖，三关场景图为1925/2057/2446帧、4,090,840/3,600,394/4,490,674B；增强实际Canvas专项拒绝任何未加载的被调用sprite。鹿与魔法花在最终桌面/手机图已看见。不是吞错或把未就绪帧记为完成。

新关index/group/mode/Arcane/tower-group JSON沿用现有readMetadata+gzip无损解码，web原目录仍raw fallback，所有需压缩文件随实际build生成。最终第4冷100ms/1.5MBps/cacheoff完整desktop HUD、真实title/save/map/book后隔离进入关卡：14,566,000B/199请求，book5.856秒/总15.514秒，首次通过15MB。未去图/降质/改透明RGB/抬预算，实际一级建造与四预览必需资源均已就绪；后续升级图在真实需要前加载，不买成功后补图。不是所有线上线路速度保证，也不代表第5/6预算已通过。

463Node通过；真实四塔1→2→3及Arcane交易/全退款、延迟加载→Escape不重开、故意网络失败→不扣钱/不升级→重试、实际Canvas无未加载sprite/World快照不变、手机/暂停/缩放/清理通过；另原九模式/存档手机、UI、焚林、睡眠箭和三关资源预览回归通过。受控stage4样本初金500+3个原ettin实际奖励210，最后artillery3截图45金币=710-665，非加钱测试。旧World玩法/旧九模式策略未改。

自然战斗仍未完整验收：以前三战役自然XP5277通过原trainHeroSkill训练multishot2、真实500预算优先树屋两兵的独立campaign样本19命/1漏、可三星，但不是完整UI新关存档/模式发布。英雄挑战合法赚星购买升级并换策略后最高140/142仍lost，后两名ettin在最后缺少防线时恢复满HP700，英雄已死亡；诊断日志保留，不削回血/加金/改HP去迁就。`max_upgrade_level=2`是全局天赋上限，不是塔层级：World原allowed本来就正确允许第4挑战三级及未锁Arcane，本批没有改玩法解锁；早期手动策略只规划二级属于策略局限。新关旗路/奖励/save/通知和三模式天然流程仍待验，入口继续关闭。

最终包1569files88,126,620B；原九模式/存档手机全正常exit0（第三campaign入关自然XP4705，末XP继续积累），旧冷入口14,657,823B/214请求仍过。公开本轮一次manifest.117且tier-pages-ui完整exit0，推送新版后不轮询。原无技能baseline策略的失败未改成“验收通过”，新关仍需真实地图/奖励/save/通知与自然挑战闭合。


## 0.2.119 第4关真实发布链

从新存档原前三campaign连续赚得XP5277和9星，真实训练multishot2后，第4campaign19生命三星（513杀/514实际生成，含载兵与脚本）；用该关自然所得XP训练multishot3，再用已赚星购买7项已实现天赋，heroic142/142、iron95/95无漏怪。测试仅发出真实购买/出售/集结/移动/施法命令，不改金币、HP、伤害、经验、RNG或冷却。英雄挑战末波卖掉已不覆盖出口的塔，用真实退款雇树屋盟友、集结610并保持英雄出口远程，是合法测试策略，不是产品数值修补。

Repository只对发布4关开放访问；旧第三关胜利存档迁移仅开放第四关入口，不赠星或XP。Renderer在资源decode且当前事务仍有效后才原子切换stage catalog，回旧关恢复base catalog。源桌面第四旗(238,595)和六个原道路点补入固定声明；新敌通知/肖像、第四关桌面书页缩略图均取原图无损裁切。原载兵共用鹿角鹰信息，没有伪造独立通知。

浏览器自然战斗回放为加速World时钟的合法玩家API命令；预载计划会用到的塔图以隔离战斗验证。实际生产冷入口另用真实 earned 前置存档、第四旗→书页→入关单测，严格15MB，不将预热自然回放冒充冷加载。未取得原版同输入逐像素证明，整体仍非完整1:1；5/6的Alleria、投石车和最终首领链等缺口继续见下文历史记录。

最终浏览器连续新档回放与纯测分开记录：前三campaign后第四campaign18生命三星，真实额外训练ultimate1/porcupine1/nimble1（double_strike因剩余点数不足未购），用第四关已赚星补兵营两项天赋；heroic142/142、iron95/95，末XP18610。此前只训multishot3的浏览器策略136杀后失败，保留日志，不削怪/改数值。实际生产路径冷加载14,641,079B/205请求、书页7.196秒/总16.615秒（100ms/1.5MBps/cacheoff）；不同线路不保证同速。旧存档解锁4时消费migration并保存，防每次重载重播道路/旗帜奖励。

最终467Node全过；actual build1582files88,410,115B。stage4-release-browser-trained连续新档三模式、stage4-release-presentation-final旧档迁移一次/原书页与手机、stage4-production-performance-final、stage4-release-old-nine-publish旧九模式、stage4-release-ui-final与old-performance-final均正常exit0。原17照片变换与tower-assets真实四族交易/失败重试/手机也正常exit0。旧冷入口14,683,697B/215请求。早期启动在build尚未收齐时map超时、第四旗声明遗漏、较弱英雄挑战策略失败、旧截图采到book opening前和needsTransition误当道路标志的fixture断言均保留日志并纠正；没有将TERM143的早期旧九模式/冷路径当成功，最终独立全链收exit0。

## 0.2.120 第5关投石车连续分支（入口仍关闭）

`stage5-catapult.mjs`接原level05十项campaign、三项heroic时间表，iron无投石车；第1波前不生成，提前跨波时按源等待分支跳过，下一Worldtick插入。路径5/6、原spi2、stop_ni40/41，以严格近节点阈值每tick最多推进一节点，45速度进场；隐藏血条/vis F_ALL并解除阻挡，抵达后恢复，停留时间是到位后leave-enter，而非开波后的绝对leave。严格5.6667秒后原随机目标+chance，33帧释放、81帧shoot等待；已有射击完成后才检查离场，反向沿原路退回，不漏命/不赠金币。死亡保留原100奖励一次、普通末帧3秒展示cache；完整特殊死亡/原global IDs与native协程队列仍适配。

专用`enemy_bomb`由APK模板明确指定，不复用我方bomb或torch。from30,90随朝向，to取释放时目标hit_offset，之后固定不追；flight=2+distance*.0013333，g-900；初角一次World.random，**两方向均正向spin10.4719**（不是我方炮石方向符号）。原while elapsed+dt<flight职责适配到模拟tick，命中在最后实际位置前于to；AOE筛选围绕to的50/.7椭圆，伤害衰减却用实际弹位置，floor150..200物理、不抽伤害随机、不附burn/假stun。飞行目标原特殊分支保留。FX在to、原z3000/sort_y-5（此controller不清成0）、19帧，crater原1秒保持/2.5秒淡完，sprite原z3400/anchor/hide8/实际角度进同queue；draw不改World。通用原damage队列、实体枚举、blood/pop/音效/全部modifier仍未全。

`extract_stage5_catapult.py`仅-bl审计原game_scripts9026–9100/9053–9062、scripts.enemy_bomb2305–2438、level05与共享SU/模板，level时间表通过jit.util.funck只读proto（连controller顶层chunk都不调用）。原4模板与137帧独立无损组770,718B、原PNG SHA/逐RGBA/size/trim记录；只stage5按需decode，旧1314塔compact仍2,122,316B，不因专用声明的catapult_proy拉入旧冷包。新原肖像0051直接APK PNG裁切exact=True，UI616图、原中文名导出；旧图编码与字体角色不变。

476Node通过。actualbuild专项使用隔离stage5：真实70购买与支援施法、真实World时钟生成/走入/原射击/石弹扣士兵HP/退场，Canvas原q/alpha/旋转矩阵/只读模拟、原肖像真实选中、pause/wheel/手机CDP触摸/原图清理与旧World隔离通过。最初点击建塔后镜头外的波旗失败，改用现有真实Space键开波，不force按钮或跳门控；为实际看见上侧车，用真实鼠标拖镜头上移，未改原坐标/z。最终hold/shot/mobile图已人工看见右上投石车与弹。受控波2/队列/时钟，不是第5自然通关或同输入原版像素证据。

第5Alleria第二英雄、原猫/控制与预建兵营完整职责、其余允许高级塔/自身预算和自然模式仍欠，第5/6入口继续关闭。第6首领结局未做，普通15波结束不能作为自然完成。前四关12模式、旧存档4解锁与资源就绪事务保持。

最终包1588files89,220,717B，476Node、catapult-browser-publish（实际pan后车/石弹可见、原肖像选择/CDP）、catapult-old-nine-publish原九模式/存档手机、catapult-stage4-natural-publish完整第4连续三模式、UI与两条性能全部正常exit0。旧冷入口14,696,446B/217req、book7.232s/总16.586s；第4生产入口14,653,828B/207req、book7.210s/总16.636s（同100ms/1.5MBps/cacheoff），非普遍速度保证。第五关自身预算未验，入口仍关。

源条件还包括字面min_x实际比较目标y>150、x<800，不能改成猜测的欧式射程。退场标记后拒绝滞后伤害支付100奖励；holding没有伪造全局无敌。早期纯测未隔离原预建三兵而污染目标/射击断言、17位IEEE边界样本过早等均改fixture未改阈值；首次源proof取到早先bullet引用而非注册定义，已纠正为完整catapult模板段。首次原FX helper默认为.6，已实际改用源19帧并补保持/淡出测试；最终重build验证。原普通炮石包曾被新声明catapult_proy多拉1帧，已按独立图组边界实修，最终1314原包不变。图中330金币为原400-真实70购买，未直接加钱/写HP来制造伤害或胜利。


0.2.121接入第五关Alleria独立基础战斗：原40,190入场/HP210/速度90、近战10–15、普通箭与special三箭、独立眩晕/受伤/15秒死亡等待与respawn、23HP离战回复，不借Eridan等级表/临时援军寿命，不把伤害XP写主英雄。原112帧完整hero动画和箭图独立237帧无损组，只第五关加载。Canvas点角色→道路移动为当前道路适配，完整原grid waypoints/多英雄头像选择栏/猫controller仍未完成；因此第五关继续关闭，不称完整Alleria或整关还原。controller只读-bl，source proof在tools/sources/stage5-alleria.json，特殊死亡/全queued时序/尾粒子音效仍欠。

本批最终482项Node测试通过，实际build1593files/89,600,131B。Alleria actualbuild专项验证原112帧中实际shoot的Canvas裁图/不改World、真实Canvas点角色与道路、普通箭真实伤害、独立HP/死亡复活/不写Eridan XP、暂停、844x390真实手机CDP触摸暂停、地图清理；投石车专项回归也通过。猫/完整grid waypoint/原第二头像栏尚欠，不称完整Alleria。初浏览器新stageHero未计入renderId导致RAF异常，已实修；另一次damage断言被原ettin回血回满误导，改记录实际hurt下降且隔离主英雄，没改原怪物回血；最初mobile仅CDP override仍截1440旧viewport，最终setViewportSize+innerWidth844断言/真实触摸后截图。
原完整天然九模式/存档手机、连续第4campaign19命三星/heroic142/iron95、UI全通过。补新英雄复活动画期间pending近战提交保护后最终build重新完成，Alleria/投石车/UI/两个性能串行正常exit0。旧冷14,709,528B/219请求，book6.253秒/总15.628秒；实际生产第4旗书冷入口14,666,910B/209请求，book7.160秒/总16.604秒，100ms/1.5MBps/cacheoff均<15MB，不承诺所有线路。第一次性能恰遇重新构建导致boot超时exit1，未计通过，收齐构建后最终串行通过。公开一次manifest .120与完整UI exit0，本批推送后不轮询CI。第五自身预算/自然三模式未验，仍只发布前四关12模式。


0.2.122接入Alleria原猫伴随控制器：初respawn完成后queue/下一模拟tick创建，同一owner只一只；原cat不可选择/ignore_damage/F_ALL，不进入普通援军/敌方target枚举，没有补兵/寿命或伪造猫伤害。源game_scripts8307–8371扑击只在.3秒queue音效请求，没有queue_damage。当前保留69速度/10..100距离仅控制前走而非拒绝扑击、46帧attack、2..3秒结束后随机cd、主人近战时scared双播与5..5.333秒cd、死亡toSad→sadSigh→随机1.5..3等待→复活toStand，已经开始的动作/行走不粗暴中断。音频实际播放与idle_flip仍未接，不能称猫全状态1:1。
catRallyPoint读取原level05_grid16格/ceil-clamp/原WATER|CLIFF|NOWALK gate，最近当前有效路径节点-5且拒绝无效，不伪夹到终点。原初始nav_rally.center/pos在APK读global pos(nil)，实例不伪补初始字段。完整NF_RALLY节点flag生产/动态terrain/grid waypoint绕障碍仍是适配边界；当前道路移动与viewport valid-bounds沿既有模型。主人移动请求按原cat下一轮outerloop消费，不能盖掉正在扑击/悲伤wait。Renderer独立cat只读pose进同actorqueue/原anchor.z3000，无血条，World实例丢弃后自然清理。237帧328080B原独立Alleria组原先前缀闭包已经含102猫帧，本批只追加原cat声明/grid数据，没有新图下载或改变RGBA。

最终489Node全过；actualbuild1594files89,624,172B，cat-browser真实Canvas选Alleria/道路移动、World.step源猫入场/随行/主人真实近战触发扑击、原cat q/alpha/矩阵/无missing与draw前后World快照不变、主人实际hurt死亡→悲伤→15秒复活→站起、单猫/no援军成员/400金币不变、pause、844x390 CDP触摸暂停/地图清理均正常exit0。attack/sad/mobile截图已人工看，受控第5样本非天然通关或原版同输入。没有额外图包下载，原237帧图保持328080B。
Alleria专项回归、天然原九模式/存档手机、连续第4campaign19命三星/heroic142/iron95、UI、旧/第4实际生产冷入口全部正常exit0。冷100ms/1.5MBps/cacheoff旧14,731,033B/220请求、book7.165秒/总16.546秒；第4旗书入口14,688,415B/210请求、book7.203秒/总16.681秒，仍<15MB，无抬预算/降质，不保所有线路。最终source/data/catalog重提与实际build逐字节一致；本批无产品/浏览器失败或挂住待收。logs artifacts/cat-tests.log/build.log/browser.log/alleria-regression.log/old-nine.log/stage4-natural.log/ui.log/performance.log/stage4-performance.log/pages-ui.log。公开一次manifest .121与完整UI exit0，新推送不轮询；第五自身预算/自然三模式/原多英雄选择栏、其余高级塔等还欠，第5/6继续关闭。


0.2.123第五关桌面双英雄头像已接入：原shared desktop与KR3 HudBottom.add_hero交叉，Eridan左框x8/Alleria右框x92、18GUI叠合、separator原pos101,3/anchorY101，powers parent由105移175；GUI纹理768/1080与原102x101按钮尺度不混World贴图。原heroPortrait_L/R1..29、separator与Alleria0019共60帧256498B独立组，固定原声明/控制器/PNG SHA并逐RGBA/size/trim验证，只含stageHeroes的第五关在创建HUD前读/decode。旧单英雄路径保留；DesktopBattleTop.readyPromise包含新组，World/owner/destroy保护取消中的旧请求，不给旧场景回填DOM。
点击右头像/Canvas选择Alleria后只调用其移动API，H与左头像/Eridan终极技能和XP身份独立，死亡会取消右选择并禁用，原遮罩/回复后levelup帧/hover/selected从实际HP/死亡clock读。Alleria原level3、xp11299用5300..11300算5999/6000，不用Eridan成长值；没有伪给XP或改World战斗/RNG/金币。两头像同原一秒outquad下移并恢复，手机同desktop profile真实触摸选择。原完整grid waypoint/Alleria专有infobar/键盘多hero轮选、第五关Blade和整体自然三模式/资源预算等尚欠，不称完整5或1:1，入口仍关闭。source tools/sources/desktop-multi-hero.json与extract_desktop_multi_hero.py接全量提取。

本批493Node全过；actualbuild1597files89,892,408B。multi-browser-final真实左右头像切换/Canvas右英雄移动而左target/XP/ultimate不变、源左右frame/肖像q/healthbar真实160HP/等级3与XP比率、draw World快照不变、死亡禁用/取消/15秒复活、1秒hide/restore、暂停、844x390 CDP触摸、地图清理通过。额外fresh page将新图组HTTP挂起，showMap后才放行，ready完成仍无右头像/separator残留，实际验证owner取消。桌面/手机/dead截图已人工看，受控stage5样本非自然5/同输入原版同步。
猫、旧桌面bottom专项、天然原九模式/存档手机、连续第4campaign19命三星/heroic142/iron95、UI、两个性能均正常exit0，无本批失败/挂住待收。cold100ms/1.5MBps/cacheoff旧14,736,631B/221req、book7.131s/总16.606s；真实第4旗书14,694,013B/211req、book7.213s/总16.778s，仍<15MB，无整atlas/OTF/抬预算/降质，不保所有线路。old towercompact1314frames2122316B保持，新双hero图组未进入前四关冷路径，第五自身预算仍未验。公开一次manifest .122且multi-pages-ui正常exit0，新推送不循环等CI。最终logs artifacts/multi-tests-final/build/browser-final/cat-regression/bottom-regression/old-nine/stage4-natural/ui/performance/stage4-performance/pages-ui.log。


0.2.124第五关剑咏者之殿基础链已接通：保留四基础TYPES，barrack runtime level4映射原tower_blade并验证真实菜单action_arg，第四关原锁blade保持，第五只开放已实现基础升级。275金币原价，三兵HP200/armor.5/速度75，source升级新unit满血/继承存活旧兵位置和集结，不错误沿旧通用比例血量；原预建2级兵营先250到3再275，spent525，战中退款315（wave0全退）。三项perfect_parry/blade_dance/swirling仍disabled/拒绝交易，不称全塔技能完成。
web/blade.mjs独立基础兵controller：源U.attack_order按chance小到大，原attack2(.33)/3(.5)/1(1)、各strict cooldown与forced1秒门，失败只重置自己的ts；5/30命中才提交attack/forced时钟、原10..14整数物理真实伤害，17/18/21帧动画不冒通用attack。source unit_dodges即使chance0仍在合法普通箭/敌近战调用处抽一次；health.on_damage的0级提前返回则不抽，blighter energy与AOE仍直接伤害，不造格挡/全局免伤。原随机姓名/初sprite时钟新单位各消费一次，不改旧单位/旧九RNG。
普通死亡严格15秒后移除，再由原塔开门结束排入新对象三兵名额，非同对象满血返生；door_hold.5/close等待，尸体占名额，tower.blocked不启动新招募。离战2秒后原每strict1秒+25，真实集结会取消未提交攻击。原特殊死亡/blood/pop/audio/native队列ID和完整路径/插入时序仍适配。基础revive.disabled默认true，未伪造启用未实现高阶天赋。source upgrades proto99 TDUP41仅列basic1..3的fencing（所以blade不降价），TDUP45包含blade的expert rally（145→160），只扩新模板此作用，旧数值不改。
新142帧301774B blade独立组按实际逻辑动画indices选完整门/兵动作，无损RGBA/size/trim/原PNG与controller SHA审计；不把整个物理door prefix覆盖旧1..3门图。仅stage5/6隔离catalog含声明/frames，真正3级菜单预览与交易前由原prepareTowerMenu decode，四关首包/原towercompact1314frames2122316B不变。原portraits_towers0005直接APK PNG exact裁图，UI617图，其余编码不改。tools/extract_blade.py/read_blade_upgrade_rules.lua/source blade.json全量提取已接，controllers只-bl/原proto常量读取不执行。

最终502Node通过，actualbuild1603files90,230,189B。blade-browser-publish/visible真实Campaign原预建升级250，再由两只原ettin死亡各70支付275，400+140-250-275=15，无直接写gold；真实菜单/技能disabled/集结与Space开波、World.step原三兵攻击真实减HP、源Canvas q/alpha/矩阵/原body与绘制World快照不变、原15秒死亡后新ID/开门补回三兵、pause/wheel/844x390 CDP触摸/地图清理正常exit0。desktop/mobile图已人工看，最终capture等真实HUD/infobar动画收起，非手改图面；受控stage5时钟/敌人样本不是天然5或原版同输入。
旧双英雄专项、原完整天然九模式/存档手机、连续第四campaign19命三星/heroic142/iron95、UI/两性能全部正常exit0。cold100ms/1.5MBps/cacheoff旧14,744,458B/223req、book7.167s/总16.635s；第4真实旗书14,701,840B/213req、book7.211s/总16.769s，均<15MB，无整atlas/OTF/抬预算/降质，不保所有线路。原新塔图未进前四关首包，第五自身预算/自然三模式仍未验。公开一次manifest .123且blade-pages-ui正常exit0，新推送不轮询CI。logs artifacts/blade-tests-final/build-final/browser-publish/browser-visible/multi-regression/old-nine/stage4-natural/ui/performance/stage4-performance/pages-ui.log。
前两专项失败如实：测试误用data-type取菜单upgrade（真实data-tower-action），修fixture；继而敌人固定road0离原集结超60，改选真实最近road/node且同步d/xy后合法起近战，不改产品range/伤害/金币/门控。早期extractor source tower_barrack结束行误1852，按原-bl1769–1850纠正后才输出。所有失败session已收，无产品异常/后台遗留。


0.2.126第五关隔离冷入口诊断：真实title/save/map/book后进入未发布stage5，完整desktop双英雄HUD，100ms/1.5MBps/cacheoff实测15,532,002B/221requests，book6.838秒/总16.693秒，15MB断言明确失败。原catalog/进度/World绘制快照未改，无missing，未请求旧7.3MB扩展整图；这是关闭入口下的诊断，不是第五正式旗书发布路径/自然通关或预算通过。需再减少约532KB及将来第五书页增量，不能提高门槛/降质/清透明RGB/把必需图假延迟。可在实际菜单预览/交易前严格decode与owner校验的基础上，进一步按真实初级塔依赖分组；未实际交付前不称已优化。探针及失败日志保留ignored artifacts/stage5-resource-probe.mjs、stage5-resource-probe.json、swirling-stage5-budget.log。


0.2.127最终包第五关隔离冷入口仍失败：100ms/1.5MBps/cacheoff15,537,493B/223requests，book6.820秒/总16.726秒，15MB断言exit1。原catalog/progress/World绘制快照保持、无missing/无7.3MB整图；原Alleria/投石车/预建兵营2级/本关场景均真实加载。此项不能当通过，也不以旧四关预算冒第五。下一批应集中解决约537KB及未来正式书页增量，并推进合法自然三模式与发布链，不再重复磨三个已接技能。日志artifacts/dance-stage5-budget.log及stage5-resource-probe.json为最新样本，旧.126失败仍保留历史。


0.2.133验证记录：558项Node全过；actualbuild gnoll-browser-selected真实Space开波后原路120,459附近受控spawn，World.step自动开场吼叫/28个真实召唤、普通近战与踩踏实际扣HP、原Canvas q/alpha/已decode/draw纯读、原肖像点选、死亡仅首领奖励1gold/无清场奖励、34帧后death-complete且100秒原尸体/仍不假won、pause/zoom/844x390 CDP触摸/退图清理通过。截图已人工看，非天然第6或原版同输入pixelcert。原天然九模式/存档手机、连续1–4→5自然三模式、UI和援军真实音频回归通过。音频首轮手机触点断言失败，未改产品/门槛的独立repeat正常exit0；首领专项初错nearestRoad返回road字段、出口前fixture导致先漏怪，以及不存在的infobar canvas selector均是测试错误，最终纠正后全流程exit0。

最终0.2.133构建1645files/94,184,262B，所有web运行模块/新资源逐字节一致。cold100ms/1.5MBps/cacheoff旧14,816,173B/233req，第四真实旗书14,773,546B/223req，第五14,956,853B/234req，均<15MB，不承诺所有线路速度。第五仅43,147B余量。第6仍单独关闭、预算另有失败记录；不能把旧五通过冒第6通过，也不抬15MB/降质/整atlas/清透明RGB。主要logs artifacts/gnoll-tests-all/build/browser-selected/audio-repeat/natural4/natural5/old-nine/ui/performance/stage4-performance/stage5-performance.log。

第6新独立boss包真实加载后，最终隔离冷入口17,754,938B/225req、book8.406秒/总18.419秒，明确超过15MB。实际调用无missing/unready、原catalog/进度/draw快照不变；assert不能称通过。此次预算浏览器在输出报告后关闭挂住，Node2696比daemon88207后精确TERM收143，未冒exit0/exit1；其他专项与公开UI均正常结束。下一批先补boss aura与父囚车链，再按真实依赖/阶段decode解决第6预算，不能抬门槛或删当前必需图。

0.2.134最终构建1646files/94,384,432B（含manifest），运行模块和新图组逐字节等源码，原固定源重提通过。首领基础实际浏览器回归aura-boss-repeat、连续原1–4→5自然链aura-natural4/natural5、天然原九模式/存档手机aura-old-nine、UI/aura-pages-ui均正常exit0，第四campaign19命三星/heroic142/iron95，第五campaign20命/heroic201/iron147/末XP37600。cold100ms/1.5MBps/cacheoff：旧14,821,929B/234req、book6.334s总15.958s；第四真实旗书14,779,302B/224req、book7.227s总16.930s；第五14,962,609B/235req、book7.833s总17.523s，均<15MB不保所有线路。第五余37,391B，后续第6大数据/图继续按实际关卡依赖加载，不抬门槛/降质/清透明RGB。主要logs artifacts/aura-tests/build/source-final/browser-repeat/boss-repeat/natural4/natural5/old-nine/ui/performance/stage4-performance/stage5-performance/pages-ui.log。

第6最终隔离冷入口17,768,097B/226req、book8.393秒/总18.415秒，15MB断言明确exit1；baseCatalog/progress/draw不变，无missing/unready。当前完整boss+光环图真实初始decode而超标，下一批真实囚车/阶段加载与依赖预算继续做，不冒旧五过当第6过。Sites首次archive上传在Azure Korea连接阶段184秒失败，先listversions确认没有新source cb61d6f...版本才重试，未重复保存已存在版本。
