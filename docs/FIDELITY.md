# 动画保真记录


## 0.2.144：第7关 faerie 暂存运输（隔离验证）

`web/stages/faerie.mjs`接原18716–18858/18864–18920的基础连续流程。按原FAERIE1024格与每条道路第一lane编译半开区段，原第4路[35,70)、第5路[77,110)，索引保留一基；实际数据无开放尾部，不凭猜测填源global ni。path_speeds数字0/1保留，默认yellow30、显式red75。独立nav移动，不覆盖敌人speed；移出战斗集合、释放当前减速/中毒/睡眠/ward所属效果、解除当前blocker，保留原对象/HP/gold/id。limbo保持Hoplite组计数，重插不重加；恢复原对象后重启已接controller时钟。已发普通hurt持有引用时仅第7拒绝limbo伤害，不给旧六关增加state/RNG。

原两层同色nav（静态球+原动画）与入/出smoke、大小比例/anchor/z/tween纯绘制；原粒子发射器、完整通用mod/aura移除、native insert/remove队列与IDs、stun_force全部状态、所有敌人重插协程和动态路径仍为适配或待补，非原版同输入1:1。当前释放自己拥有的睡眠计数，保留外部stunned/其他计数；并非通用清空眩晕。source新增nav/fx/粒子声明闭包，4679逻辑帧/6,369,762B无损，未清alpha0RGB/整atlas；旧4/5/6图与1314frame compact保持。第7入口仍closed、正式前六关18模式，自己的预算和其余必要机制仍欠。

0.2.143第7隔离重装羊人已接原施法/三次召唤/零金币羊人入场与共享并发计数组、尸体释放和实际子兵双刀。正式仍前六关18模式，第7closed；详STAGES-7-10，不冒天然通关或完整1:1。

0.2.142第7隔离羊人双刀已接三段动画/两次queue飞刀/原抛物线与命中伤害，生产仍前六关18模式，第7closed。详见STAGES-7-10，不冒自然通关或21模式。

0.2.141开始第7关“石环阵”隔离还原：原毒南瓜25秒准备、点击空放也消耗、17帧范围释放、4秒减速与毒抗DOT/恢复、原烟雾/贴图和手机触摸已接通。611Node与实际Canvas专项通过，前六关18模式保持。新第7冷入口16,852,393B明确超15MB且专有新敌/faerie_trails/Druid/自然模式等未全，入口仍关闭。详见 `docs/STAGES-7-10.md`；不把隔离机制或原图导入称新三模式/全像素完成。


0.2.140正式发布第6关「狮鹫驿站」三模式，生产cap6/前六关18模式。原flag6(609,814)、9道路点与stage_thumbs_0006原342×246书页来自固定map_points/desktop atlas声明，RGBA裁图无损；原第一波TOWER_MAGE_WILD_MAGUS通知与狂野魔术师百科接通。旧第五胜利save只迁移访问6，不赠XP、星或挑战；原道路旗揭示一次后保存。真实胜利再记第6星/挑战，手机重载保留。第7关仍拒绝。不是整关/全系统1:1像素认证。

百科专用声明改为实际统计字段投影，逐塔/敌与原完整模板统计对比一致；战斗仍由ExpansionRepository按关完整模板原子替换/解码，不删战斗图或弱化机制。此举修复发布初包把第五冷入口推到15,021,175B的失败，不抬预算或降质。原compact1314帧2122316B和所有战斗图字节不变。

浏览器真实第五已赚checkpoint XP38903起，合法训练/天赋后按World API连续战役18命三星、英雄120/120、铁人169/169，首领death-complete/父complete、原通知发现、奖励存档和手机重载通过，末XP48653。测试以固定步长驱动World，批次间真实等待第14波boss/cart网络decode；控制测试宿主RAF避免同一World被两个时钟推进，不写HP/gold/伤害/seed/cd或assetsReady。不是原版同输入同步。初较弱策略13/17命和一版iron lost保留，最终仅合法策略emergencyRange campaign350/iron220；默认CPU旧计划保持。CPU新档1–4→5→6自然链仍20命零漏/heroic120/iron169，末XP47121且真实recordVictory记奖励。人类援军叠音.132修复保留。


最终验收：601项Node测试全过；原完整天然九模式/存档手机、连续新档4/5/6 CPU自然链、stage6-browser-final完整三胜奖励/手机重载、stage6-presentation一次迁移/原书页与UI通过。另一publish浏览器也已写完三胜/手机结果，但Node在关闭阶段挂住，确认无子进程并比daemon88207后精确TERM收143，不称exit0；其后独立弱策略iron失败保留，不把策略搜索失败改产品值。最终重试流程允许真实点击“再战一次”，只沿产品事件保存实际earned XP，不伪造存档/奖励。

最终actualbuild1666files/96,300,852B含manifest；web模块全逐字节一致，原第6缩略图RGBA exact。cold100ms/1.5MBps/cacheoff：旧14,852,300B/240req，总16.096s；第四真实旗书14,809,678B/230req，book7.172s/总16.991s；第五14,992,983B/241req，book7.852s/总17.722s；第六真实旗书14,933,653B/240req，book8.134s/总23.728s，15MB全exit0。第6总时长含旧存档首次道路旗揭示；不保所有线路。第五仅7017B余量。boss/cart事件仍另实际下载3.87MB，不称整局总流量15MB。公开本轮一次manifest确认.139/UI exit0，新推送不轮询CI。

主要logs artifacts/sixth-tests-publish/build-publish/browser-final/browser-publish/browser-publish-repeat/browser-retry-flow/presentation/natural-final/old-nine-build/ui/pages-ui/performance-publish/stage4-performance-publish/stage5-performance-publish/stage6-performance-publish.log；sixth-browser-publish是关闭阶段143，repeat是弱iron策略失败。完整正常browser-final保存了真实三模式/奖励/手机结果；不同输入/初始时钟下自动策略不保证零漏。当前普通15波后必须实际囚车/首领/死亡收尾，最终父complete才won，没去掉机制来过自然样本。

补充最终交付记录：sixth-browser-retry-flow的独立自动计划iron多次lost保留，未修改产品数值；artifacts/stage6-iron-continuation.mjs首脚本生成误把prep的step替换成含t的片段，ReferenceError为fixture。修正后，从真实已赚第6heroic存档续铁人、真实20秒准备与原“再战一次”后169/169 won，奖励/手机重载/清理全部正常exit0（sixth-iron-continuation-repeat.log）。这是合法续测，不拿末XP51088冒首次入6前置，也不冒称所有自动策略首试必过。首次完整三模式正常browser-final，以及publish三胜/持久化后关闭143的记录保持区分。最终main/runtime cbdee0f，Pages f1af29b，私有source1d71efa75e3f588b072b6d0fedc2a2e444ca0d6d/deploy appgdep_6aee25be2758819189ea501bae73bf1e succeeded，owner-only。

0.2.139实际闭合狂野魔术师「破坏守卫」ward三级购买/施法/沉默与恢复链。原每档225/max3/目标数1、3、6，10秒strict冷却、14/30施法；第一档changed被outerloop观察才起cd，后两档不重置，首观察前连升保留原ts0。source F_SPELLCASTER2147483648且can_do_magic、原范围/vis门选最前排序列表；cast开始捕获列表，释放时不擅加新range/vis/magic门，取当时等级上限queue mod，释放后再记冷却ts。已开始phase不因tower.blocked中途冻结。s.wild.powers独立，塔810+技能675=spent1485/战斗退891；eldritch与普通交替手/same计数保持。

原mod_ward经game_scripts共享scripts表继承mod_silence.insert/remove（4889–4921）与mod_track_target.update（4263–4300），APK没有KR3 override；controllers仅-bl不执行。insert只有实体/health alive/enemy门，原can_do_magic/can_accept_magic直接false，remove对仍在entities的enemy直接true，不虚构引用计数或保存prior false；未改外部stunned/frozen、Arcane/Blade stun计数。同级重复仅刷新modifier.ts、不重置tween年龄；低级拒绝，高级替换；strict now-ts>10或死亡/移除后释放自己状态。不同外部沉默的完整通用组合生命周期仍不是已实现的通用引擎，不能声称全部原mod都闭合。

真实职责接到既有blighter封花新episode与harasser.requires_magic闪避门；原已有普通近战/箭仍正常。重要源细节：blighter能量attack声明requires_magic=true，但仅SU2693–2756新目标获取检查magic；已进入的ranged episode在can_range_soldier2309–2325与range_attacks2937–3131不再检查magic，直到目标失效/episode退出。所以本批没有凭直觉取消已开能量或给持有目标加新全局门；新增纯测确认已提交弹与连续episode照原继续，新获取被阻。已进入封花cast按原y_wait只被death/stun等打断，沉默不回滚已提交动作。完整原game_scripts8647–8723与SU138–157也只读审计。

原ward.bans四项中本关真实存在mod_gnoll_boss：插入后撤原HPbonus/factor并禁止pending/后续重入，过期允许原aura继续，不假阻gnawer等不在列表的增益。其他更后关卡尚无runtime的heal/consume/shadow_champion仅声明不冒已实现。本批未修改旧五关RNG/伤害/HP/施法clock；只有实际ward插入才有canDoMagic/canAcceptMagic/World.wildWards新状态。

原塔sprite5/6按source独立alpha keys（2/30→16/30淡入、25/30保持→1秒淡完），rune7原25frame后隐藏、body wardUp/Down32frame；纯draw按Worldclock，offset tween/anchor/z原样，overlay不假跟shooter.flip。目标头标原custom_offsets（blighter y39）、不再叠unit.mod_offset；两地贴z1400，其中原scale1/.4是真双轴，不套Renderer.entity旧等比scale。三mod sprite独立原0/.25/9.75/10 alpha keys并跟目标移动，same-rank刷新不重开显示年龄。真实pause冻结，卖塔不清除已经插入的modifier，丢World/换场景无timer/cache回填。

0.2.138实际闭合狂野魔术师eldritch三档购买/射线/吞噬/延时魔法AOE基础连续链。原325/185/185、max3，累计spent1505（塔810+技能695）、战斗退款903；仅s.wild.powers独立状态，ward仍disabled与World拒买。第一档changed被controller观察才起28秒strict冷却，后两档24/20秒不重置起点，首观察前直升2档保留模板ts0。原20/30射线释放、34frame施法，开始后不被tower.blocked中途冻，释放重新核health/vis/1.1椭圆，失效则按原范围重找最前目标；不改普通双手same计数或抽新chance随机。

原game_templates注册ray_wild_magus读取game_scripts.ray_simple，但APK game_scripts实际上require并返回共享scripts表且无ray_simple override，故继承all/scripts3242–3353及3248闭包，不是精灵force_motion。射线2/30后queue mod、没有普通直接伤害；追踪Chebyshev上限64相对insert时原bullet.to（非逐tick累积重置），F_RANGED或超距粘性失追，仍原hitFX但不插mod。射线原16frame/anchor0,.5/z3400，x轴距离/image_width144而y轴保持1，专用Canvas双轴矩阵，不把Renderer.entity旧等比scale当源射线正确；原hitFX/z3300。

mod下一Worldtick插入，只活/实体存在/源modifier flags门成功；同级不重复启动，高级替换低级，低级拒绝。再下一Worldtick按原systems.health DAMAGE_EAT4096令HP0，检查原health.ignore_damage/immune_to，真实一次原金币/无主英雄假XP，carrier继承原EAT禁落兵/隐藏死亡，不用超大普通伤害冒吞噬。原敌闲置render快照按eldritch_enemy_decal 0..20/30抖动scale tween膨胀，隐藏正常尸体；mod原12frame loop跟初始mod_offset，等待20/30结束后原19frame爆炸。AOE在固定初始mod.pos、87.5/.7椭圆按源flags筛活敌，下一tick80/180/260固定magic4，不乘塔damage_factor、不抽伤害随机。爆炸画面在原target引用当前pos+unit.mod_offset，和AOE中心职责不混淆。完整native modifier ban列表/queueIDs/协程同tick、敌render运行时多层快照、额外blood/pop/水格/声音尚适配或欠，不能说全部技能FX/全塔1:1。

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

0.2.134 gnoll-aura.mjs接原aura_apply_mod→mod_gnoll_boss生命周期，只实际第6目标创建状态；排队插入/同级刷新/严格过期/原HPbonus与ceil系数撤回，普通近战与infobar读unit系数，普通箭仍读bullet系数。原三静态图/环alpha-scale独立loop进actorqueue，纯绘制不写World。boss包234帧2,571,592B只第6按需，controllers只-bl。囚车/相机/结局及native队列/全modifier仍欠，第6继续关闭。

0.2.133首领基础控制器gnoll-boss.mjs只在id6/eb_gnoll实例创建状态，读取level6按需原模板，开场/节点howl真实连接现megaSpawner。近战与stomp独立phase，绘制gnollBossPose纯读，100秒死亡保留覆盖普通敌1.2秒清理；源码仍只-bl审计。source physical|NO_DODGE在boss caller开启mask护甲分支，其他hurtDefender调用维持旧规则。原boss aura/mod、囚车/相机/最终父controller及native队列/IDs/全音频仍未完成，第6不开放，不能称18模式或同输入1:1。

0.2.132修复援军近战声音：原MeleeSword五个短ogg逐字节从APK提取，原sequence/ignore.45/gain.2/SWORDS max1；替换此前误用的8秒barracks长音轨，不靠裁切/加速压缩消除重叠。真实浏览器原援军近战修前峰值3轨、修后1轨，暂停/静音/退图立即停止。其他组混音、全部原音效调用/原Love音频时钟仍适配，非全音频1:1；没有改图片/动画/World随机或攻击时序。

0.2.131刷怪器只生成真实原敌，不新增或修改图片。第6受控manualWave队列使用原path起点/支路，原actorqueue与既有图组绘制；actualCanvas检查q/alpha、已decode与draw前后World完整状态不变，桌面/手机截图用于机制验证。真实boss吼叫尚未连接，非自然6通关或同输入原版像素证书；source Lua pairs/队列IDs/path timing仍适配，15MB门未通过。

0.2.130第6固定射手与猫复用原237帧无损Alleria包，只第6按需多载已有328080B文件，不新增图片或改变RGBA。原NPC位660,625、猫640,655/z3001，NPC血条入场后按完整update显示、无可选头像HUD，独立actorqueue纯pose；actualCanvas比较body/cat裁图alpha、箭每tick切线旋转矩阵及World快照不变，桌面/手机截图人工看过。局部受控机制不是整关像素证书；完整idle_flip/音频/native队列/路径预测、首领结局与第6自身15MB门仍欠，cap5保持。

0.2.129发布第五关原旗/七道路点与书页缩略图，均固定原声明和PNG SHA，342x246原缩略图完整RGBA无损（包括透明RGB）。新增骚扰者通知/百科与Blade百科原图，原高级塔首波通知沿原通用变换；实际通知照片四角专项覆盖两高级塔与骚扰者。自然三模式验证只证明当前适配玩法的合法可达性，原视频/静态原图并非同输入像素证书；完整grid/native队列/特殊death/音频等仍欠。第6入口继续关闭。

0.2.128第五关资源依赖优化只重排无损图组。entry塔组完整1314帧逐RGBA/size/trim不变，第五场景保留1815帧与旧组逐RGBA相同；透明RGB未清理。实际Canvas检查每个调用的sprite已decode，覆盖真实菜单四族与Arcane/Blade交易、预建兵营、场景鹿/花、投石车和刀舞专项。桌面/844x390手机截图已看，受控第五场景不是原版同输入像素验收。第五冷入口14,833,565B首次过15MB，但英雄/钢铁自然挑战未过，生产继续前四关12模式。

## 0.2.92 用户截图图框错位 + 雷电/箭雨原分层

用户截图焚火者通知确实照片与边框错开。按diagnose先复现：实际frame角点相对photo为(+25.30,+28.21)物理px，原层级应为(-23.16,-17.57)。根因是子图NativeUI.image的CSS transform默认中心原点，而父照片组原点0/0；父组旋转还使用+r，与KView原G.scale→G.rotate(-r)→G.translate(-anchor)相反。修复共享NativeUI.image显式origin0/0、按原scale/负旋转/锚点执行；通知父组也按原顺序并正确处理锚点。不是裁图丢像素或手工把某张框移几像素，通用路径覆盖所有原带框通知和其他NativeUI叶图。

新增test:notification-frames通过真实通知callsite生成DOM，用Chrome DOM.getBoxModel实际内容四角与原祖先矩阵比较（.05物理px量化误差），先红后绿。验证五敌、两种技能通知、八张塔升级照片及手机重入/真实关闭；焚火者桌面/手机修后截图已看，原图完整在边框内。新增纯测原点/负旋转/非零anchor，321Node全部过；百科/英雄界面/UI与最终天然九模式（三战役三星/自然XP4705/20生命、存档手机）全正常exit0。新用户截图通过Multica CLI下载，仅用于复现，不当原版像素参考。source范围与矩阵在tools/sources/native-image-transform.json。

原任务特效分支同时完成：extract_skill_effects.py仅读原template声明与game_scripts16414–16458/3113–3118 -bl审计，生成skill-effect-data.mjs，接完整提取。SkillEffects按原ray3500/镜像爆炸3000且sort_y_offset-5/地面decal1400、箭雨地面箭1400/烟雾3000入同queue；不再所有FX最后盖单位。ray原alpha0/255,.1/255,.26666666666667/0；原image_h496或456，低落点时scaleY=max(1,(768-y)/image_h)。爆炸16帧结束，雷电decal20帧/原alpha255保持至结束，去掉旧假淡出。箭雨两sprite原alpha1秒保持、4秒淡至0，仅地面箭按原-10..5度旋转。原ray随机翻转与箭雨落箭角度用独立可注入UI RNG/WeakMap一次取值，重画不重抽，scene/loadLevel清除；World seed/技能伤害/冷却/命中时间/数组都不变，不声称Love同seed随机轨迹。

实际build test:skill-effects真实按钮施法与冷却后捕Canvas分层/镜像/alpha/.6秒地面decal不淡出/2.5秒箭与烟.5/原矩阵重复稳定、zoom/暂停/手机/重入通过。首断言把仍飞行的archer_hero_arrows_proy-f也算入落点.5alpha，已精确筛decal/smoke两sprite，不改产品alpha；旧失败结果收集。最终NativeUI修后完整特效专项再次通过skill-fx-final-frame-build.log。原powers/projectiles专项同批过。其他技能粒子/雨/闪屏、range同z3500全局tie及建造卖塔FX仍非完整global render_frames，非整体1:1。

最终build1471文件61,304,223B；冷路径100ms/1.5MBps/cacheoff真实书页入关14,181,149B/15.417s，201请求<15MB，不降画质/抬预算/整atlas。公开一次manifest0.2.91，首UI完整交互后因tower-menu.mjs一次HTTP503判失败，独立未改测试重跑skill-fx-pages-ui-repeat.log正常exit0，新版推送后不轮询。最终logs frame-tests.log/frame-all-browser.log/frame-ui.log/frame-encyclopedia.log/frame-hero.log/frame-campaign.log/frame-performance.log、skill-fx-tests.log/skill-fx-final-frame-build.log/skill-fx-powers.log/skill-fx-projectiles.log。完整本地九模式/已发布图资源仍非原版同输入逐像素验收。


## 0.2.91 四类地面敌普通死亡与尸体展示寿命

完整只读核对原SU.y_enemy_death（APK script_utils.lua2523–2654、共享vanilla2579–2700）、fade_out_entity及sys.health删除链。当前reaver/burner/gnawer/hyena模板unit没有hide_after_death/hide_during_death/fade_time_after_death，普通death分别84–99/101–126/90–110/53–71；原动画结束后保持末帧alpha255，不统一淡出。源health.dead_lifetime=2，系统只在tick_ts>death_ts+2时删除。移除旧ground敌一律1.2秒alpha降到0的显示规则。

新增ground-corpses.mjs GroundCorpses/isGroundCorpse，首次观察到死亡时只复制绘制字段，独立展示缓存补齐World现有1.2秒数组清理后的原2秒尸体画面；严格2秒仍可见、>2秒清理。缓存不进入World数组/目标/碰撞，不更改伤害/HP/金币/XP/RNG/寻路或模拟清理时序；每次draw前后World快照相同。原deathFlip/原帧与actor逐sprite层级保持，死亡血条与marker依既有World活体规则清理，泄漏不生成尸体，复活删除快照，Campaign.transition/loadLevel/owner变化reset，暂停World时间时展示寿命也暂停。缓存需要先观察到World内的死亡；完整同输入掉帧行为不称已验收。

本批只闭合四敌普通死亡显示；原血池、爆炸/分解/吞食/水面/悬崖分支与原尸体ui.z=-1点击未恢复。World未记录完整最后伤害类型和原地形状态，不凭猜测加红椭圆/假爆炸，也不开放尸体假交互。源码SHA/范围在tools/sources/ground-corpses.json；素材全已存在，没有新图下载或原始帧修改。

317Node全过，3新纯测四原模板/动画/无fade、快照不变/World移除后末帧保留/2秒严格边界/owner、活体对象不复制/泄漏/复活/飞行敌隔离。实际build test:ground-corpses用原World.hurt普通伤害后采样四种死亡帧与末帧alpha1，再实际step触发World1.2秒清理，验证数组0而Canvas仍4尸体、enemyAtPoint无目标、2.001秒全无、zoom/暂停/手机/真实showMap原门与重入清缓存。首次专项误调用不存在app.enemyAtPoint收exit1，已改导入现有enemy-selection.mjs真实方法，产品没改；最终corpse-browser-final.log正常exit0。手工置死亡取样时刻与位置属于受控fixture，不是原版同步或自然通关证据。

最终天然新存档九模式三战役三星/存档手机正常exit0，3campaign天然XP4705/20生命、策略不变。health-bars/UI、flying-enemy/enemy-infobar与公开旧0.2.90UI均同批回归。旧enemy-infobar先后两次点击等待超时，诊断重跑捕获原点512/399而敌人已沿道路回到437/614，原因是旧fixture只改x/y不改d。现helper从真实route.points选最近节点并同步d/坐标，保留真实点击与10秒等待/门控，最终corpse-selection-final.log正常exit0；未改产品选中规则。cold100ms/1.5MBps/cacheoff真实书页入关14,176,164B/15.369s、199请求<15MB，无整atlas/OTF/抬预算/降质，不保证所有线上速度。build1469文件61,298,940B。ground-corpses-last-frame.png/mobile.png已查看，当前受控样本，未称像素1:1。logs corpse-tests.log/build.log/browser-final.log/campaign.log/health.log/ui.log/flying.log/selection-final.log/performance.log/pages-ui.log。新版推送后不轮询CI。


## 0.2.90 当前弹道/命中特效与前景共同排序

只读审计原game.draw711–1230（Z_GUI_DECALS2000/Z_SCREEN_FIXED3900分段）、systems.render排序、KR3 bolt_elves13699–13831与common scripts.arrow/bomb原控制链。普通箭、炮石、英雄箭、火把和箭雨弹体原z3400，魔法弹原body3400/第二shadow3000且offset0,-20；模板一二层body scale .8/.9与静态影子1分别恢复，原anchor/alpha/trim经既有textureScale*k/camera保留。魔法弹动画从本弹elapsed而非全局World time读取；不动原force_motion/本局简化飞行位置。projectile-sprites.mjs只读派生逐sprite poses，箭/torch旧朝向保留；原抛物线速度朝向、炮石随机初始角与旋转/隐藏半径/粒子仍未恢复，不新增展示随机冒充同seed。

所有这些sprite在actor queue.flush前入队；已有Stage*_0002前景原3100也按原overrides入队一次，不再在箭雨后单独强盖。炮石命中fx_rock_explosion为3000层/原anchor .5,.23684210526316，火把命中3300/anchor .5,.25。重要动态规则：common scripts.bomb给实例sort_y_offset赋bullet.hit_fx_sort_y_offset，即使nil也清除模板默认-5；当前rock1/2字段缺省，实际实例用0，不能只抄template -5。World效果事件未存来源bullet，当前支持rock1/2一致规则以rock1声明派生，未来不同炮弹需要新增来源状态，不能泛化断言所有炮弹。源SHA与局部规则记tools/sources/projectile-render.json，素材仍既有APK catalog，无新图提取或关键图下载。

原其余技能FX、金币字/卖建特效、range与出口圈仍独立阶段，未称完整render_frames或全global z；原实体insertID流仍用稳定代理，弹道与FX缺完整源时序/状态。未改World数组迭代/时间/随机种子/金币/HP/XP/射程/伤害/冷却/寻路，未改效果生命周期。314Node全过，3新测试源body-shadow层级/级别scale/offset与sort隔离、延迟/消失/原anchor、跨单位和前景排序/实例nil覆盖。实际build test:projectile-order真实购买mage/调用原World塔开火，再用受控重叠展示fixture捕Canvas的body .8/影子1/原q/alpha/offset、impact3000->foreground3100->torchHit3300->bullet3400，World snapshot保持、真实wheel/暂停/手机CDP与场景清理通过。受控额外箭/炮石/英雄弹不是天然通关或原版同步证据。

最终天然新存档完整九模式三战役三星/存档手机正常exit0，3campaign自然XP4705/20生命，策略未改；render-order/health-bars/UI/原battle-powers/tower-ranges以及公开旧0.2.89完整UI同批回归。新专项初版预写FX key前缀已在运行前按真实catalog改为artillery_thrower_explosion；首次Node+build shell只给首npm配置PATH导致第二npm command not found(exit127)，已单独显式PATH实际build成功，非产品故障/未运行旧包。无浏览器失败待处理。截图projectiles-source-order.png/mobile.png已看，为当前受控样本。实际build1468文件61,297,494B；100ms/1.5MBps/cacheoff真实book->battle14,174,865B/15.368s，198请求<15MB，未整atlas/OTF/抬预算/降质，不保证所有线上线路速度。logs projectile-tests-final.log/build-final.log/browser-final.log/campaign.log/ui.log/order.log/health.log/powers.log/ranges.log/performance.log/pages-ui.log。新版推送后不轮询CI或宣称已验证公开新版本。


## 0.2.89 原单位头顶血条（不是底部Infobar）

只读交叉APK systems.lua1729–1845/1865–2058与vanilla systems.render1798–2113：_hb_ss为1×1角点quad、ref_scale1、anchor0/0，HEALTH_BAR_SIZES按texture_size选择，iphonehd使用default，small16×2/med24×2。原go_decals/enemy/hero图集角点实际RGBA255/255/255/255；Canvas按原rgba色块等价生成，不声称裁了独立血条图。HEALTH_BAR_COLORS原bg126/0/12/255、fg68/174/50/255，满血也显示，没有边框；不再统一36×6/34×4、敌人红填充或屏幕y-48。原hb.offset按world加到floor(x)/ceil(y)，size直接按game_scale而非textureScale缩放；perython原offset0/90与body/shadow链保持。原z/sort_y_offset/200002与200003顺序进入同actor RenderQueue，自定义draw_order0与black_bar_hp分支保留。

当前五敌、Eridan、兵营/援军读取本局模板原offset与真实HP；死亡/漏怪隐藏，英雄初次levelup（game_scripts.lua2795起先播动画再hidden=false）与SU普通respawn动画结束后再显。World没有额外hidden/water状态，本批未伪造这些特殊分支；生命/伤害/回血/复活时序/经验/金币/RNG/寻路都不改。完整全局弹道FX排序/原ID流/特殊死亡与完整动态hidden仍未完成，不能称全敌状态或像素1:1。

新增extract_health_bars.py/read_health_bar_rules.lua仅读constants声明与systems -bl审计，health-bar-data.mjs可复现且接全量提取。311Node通过，3新纯测覆盖源尺寸/原色/满血/偏移/取整/无textureScale/排序0/黑条/隐藏/复活边界。实际build test:health-bars捕获所有五敌+hero+兵营的fillRect尺寸/坐标/色值/矩阵，实际完整Canvas内部像素68/174/50/255、真实World伤害与回血方法/死亡和复活/漏怪显示、zoom/手机CDP/pause/场景清理与World快照均过。spawn/冻结/坐标布局是受控UI样本，不是自然通关或原版同步像素证据。最初回血fixture移动hero却未更新rally target，正常移动分支阻止regen；已修fixture设置同位置目标。第二次精确累加respawn时长落到浮点边界之前，改取动画后一个源帧；未改产品显隐条件或World时序。失败工具结果均收集，最终health-browser-release.log和health-browser-screenshot.log正常exit0。

原flying-enemy/render-order/hero-infobar/UI、本轮公开旧0.2.88UI以及最终独立天然新存档完整九模式三战役三星/存档/手机均正常exit0，第三战役天然XP4705/20生命，策略未改。冷路径100ms/1.5MBps/cacheoff真实书页入关14,172,383B/14.422s、197请求，保持15MB预算且无整atlas/OTF，不保证线上所有设备速度。build1467文件61,294,857B。截图unit-health-bars-injured.png与mobile.png已查看，当前受控样本非原版同步。最终日志health-tests.log/build.log/browser-screenshot.log/order.log/flying.log/hero.log/ui.log/campaign.log/performance.log/pages-ui.log。公开一次build-manifest0.2.88与完整UI成功，新推送不轮询。


## 0.2.83 桌面主横幅/中文按钮局部分支

只读取得固定KR3 desktop screen_slots atlas/layout与vanilla共用screen_slots：ref1920×1080、scale=h/1080、sw=1080*w/h，背景原点为居中1920图的左端，不套phone .5或world .842。banner pos170/1100、anchor0/521（实际原图672×543），三个有效主按钮pos160/97、174/204、202/304，第四quit221/383保留源位置但浏览器无退出能力而禁用。CSinkButton共用源码核实base normal/down，CHoverImage中文normal/hover，child按下偏移(-3,+5)逻辑像素，leave/up/cancel/blur恢复。中文是原atlas位图，不是全局更换字体。15张所选原图逐RGBA验证，tools/sources/desktop-title.json记录PNG/layout/controller SHA，extract_desktop_title.py接全量提取。

明确局部差异：原完整桌面main_menu_bg无损WebP实测2,222,858B，当前phone start背景553,616B；直接替换超过固定15MB冷路径预算。本批只接原横幅与主按钮，背景/单独logo仍phone，存档面板/删除/设置内部也沿既有phone。开始进入真实三存档；desktop主按钮不播放phone MenuMotion猜桌面动画，未恢复源侧滑panel .1秒。旧MenuMotion/SaveSlots保持phone profile，可独立回归；完整desktop背景/slots/credits尚未完成，不能称开始界面整体1:1。现有指定视频缓存没有开始页同输入取样，本批依固定源声明/原图恢复，不称视频逐像素验收。

DesktopTitle实例持资源门/ResizeObserver/按钮状态，destroy拒旧ready，Campaign owner身份检查拒旧报错；waitScreenReady包含title readyPromise，保留原scene门。专项人为延迟并中断旧catalog请求，先转saves再释放/失败，旧页面不复活、不向新窗口弹过期错误，重新开始正常。浏览器quit不假装关闭应用；设置/制作名单沿已有真实入口，非完整desktop Options/Credits重做。

新增约329KB原按钮素材，维持预算的同时按当前五敌template prefix完整提取565帧，build打包go_enemies_campaign.webp1,583,790B，逐每帧与原WebP解码RGBA验证，size/trim不变；未来未用敌帧仍指向原sheet，只有定义campaignEnemySheets的build跳过原两整图，web原目录兼容保留。没有改敌动画帧集合/战斗数值。readMetadata复用原gzip流解码/无API原JSON回退，desktop-map/catalog增加无损gzip旁文件，不降图质或提高15MB。

299Node通过，新增源按钮几何与enemy compact preload隔离；原gzip兼容测试保持。最终实际build test:desktop-title覆盖原hover/down/text sink/cancel、source坐标/手机、真实settings/三存档/slot2/return door与旧加载取消；本地UI、旧phone MenuMotion专项与独立天然新存档完整九模式三战役三星/存档手机均正常exit0。第三战役天然XP4705/20生命，missingFrames为空，World/经验/金币/HP/冷却/策略未改。公开本轮一次manifest0.2.82且完整UI正常退出，新推送不轮询。

build976文件56,458,217B；100ms/1.5MBps/cacheoff真实book->battle14,836,703B/14.910s<15MB，禁止原整enemy/tower/map atlas下载，不保证所有线上设备速度。最终logs title-tests.log、desktop-title-browser-release.log、desktop-title-campaign-release.log、desktop-title-ui-release.log、desktop-title-performance-release.log，legacy desktop-title-legacy-motion.log，公开desktop-title-pages-ui.log。desktop-title-buttons.png/mobile.png已查看，是当前phone背景+原desktop按钮的混合profile，不是原版同步证据。

## 0.2.82 四组原水晶/火花装饰

只读核对KR3 map_animations3四组声明与共享MapView.load_map_animations非loop分支：ma_hr_crystals793/196、wait8..12/1..32；ma_hr_sparks793/194、wait4..8/1..42；ma_lake_crystals848/495、wait8..12/1..43；ma_lake_sparks845/495、wait4..8/1..45。均layer1、默认alpha1、半图anchor、30fps，没有额外路径/缩放/动作切换。复用现有非loop规则：初始ts=to/30末帧，整数随机等待后ts0播放一次，dur+下一整数wait再启动。没有CSS呼吸或改World。UI RNG仅展示，不声称Love同seed或原timer掉帧轨迹一致。

新增162原帧，tools/sources/desktop-map.json保存声明/原PNG SHA（已缓存1..5），extract_desktop_map.py从所选animation prefix派生ambient组，逐所有630帧裁图RGBA验证，接全量提取。ambient无损图从31130到57862B，未整原atlas预载/降低画质/提高15MB。所选七装饰按原声明顺序George/vine/HR crystals/HR sparks/lake water/lake crystals/lake sparks绘制，背景后under遮挡前；旧lake专项原states[0]假定改成按id查找，保留原帧边界断言，不为测试保留错误声明顺序。

297Node通过，新增四组原pos/wait/末帧保持/独立重播间隔与所选声明顺序/数据不变。实际build test:map-crystals捕获四对象初始/4秒/8秒的drawImage原q、trim位置/alpha1与顺序，真实book/modal继续、pan/原生scroll0、手机CDP入关与销毁均正常exit0；原test:map-ambient、本地UI/公开旧版UI、独立天然新存档完整九模式三战役三星/存档手机均exit0。第三战役天然XP4705/20生命，World/HP/金币/冷却/经验/策略都未改。受控UI clock及当前截图不是原版同输入逐帧或自然通关证据。

build957文件54,526,414B；100ms/1.5MBps/cacheoff真实book->battle14,940,202B/15.121s<15MB（仅余约60KB），不保证线上所有设备速度。公开本轮一次manifest0.2.81且完整UI正常退出，新推送不轮询。最终logs crystals-tests.log/crystals-browser.log/crystals-ambient.log/crystals-ui.log/crystals-campaign.log/crystals-performance.log，公开crystals-pages-ui.log。desktop-map-crystals.png/mobile.png已查看。其他地图装饰/运动层、完整光效与像素对照仍未完成，整体非1:1。

## 0.2.81 原藤蔓待机/动作连续状态

只读核对KR3 map_animations3.ma_venom_vine_1与原共用MapView.load_map_animations完整非loop分支：pos785/664、layer1、84×52完整图面/半图anchor，idle1..48、action49..79、30fps，wait整数8..12。初始animation=idle、ts=48/30且loop=true；初次wait向上取到1.6秒idle周期整倍数，即8/9.6/11.2/11.2/12.8秒。动作时切action/ts0/loopfalse，31/30秒后回idle/ts0/looptrue，下一动作在该dur+新的周期化wait后发生。没有把1..79直接loop或额外改位置/可见性。

MapAmbient新增独立active animation/loop/returnAt，按名义事件顺序处理动作返回与下一动作，旧lake和George行为保留。UI RNG独立于World，不声称Love同seed随机轨迹或原timer掉帧后逐帧一致。Canvas用原pos/trim、背景后under遮挡前绘制，modal继续/场景销毁清引用，不插战斗实体、不改HP/金币/XP/冷却/进度。tools/sources/desktop-map.json记录原79帧与idle/action规则，既有原PNG1..4 SHA复用；extract_desktop_map.py接全提取，所有468选中帧逐裁图RGBA无损验证，ambient紧凑图由4410到31130B，不整atlas预载。

295Node通过，覆盖整数wait周期化、idle末帧、action首末帧、dur后返回/下一动作以及销毁。最终实际build test:map-vine捕获原drawImage帧48/49/79/1/2及trim位置，真实modal继续/手机pan/原生scroll0/CDP入关/销毁通过；原George专项、本地UI、公开旧版UI与独立新存档完整九模式三战役三星/存档手机均正常exit0。第三战役天然XP4705/20生命，World/策略未改。专项临时UI时钟与截图不是天然通关或原版同输入逐帧像素证据。

build957文件54,478,590B；100ms/1.5MBps/cacheoff真实book->battle14,892,378B/14.187s<15MB，不保证线上所有设备速度。公开一次manifest0.2.80且完整UI正常退出，新推送不轮询。最终logs vine-tests-final.log/vine-browser.log/vine-george.log/vine-ui.log/vine-campaign.log/vine-performance.log，公开vine-pages-ui.log；desktop-map-vine-action.png/mobile.png已看，原动画当前取样。其他地图装饰、完整光效与像素对照仍未完成，整体非1:1。

## 0.2.80 第一大陆 George 原单次装饰动画

只读交叉KR3 map_data.map_animations3首项ma_george_shout_1（7326起）与原共享MapView.load_map_animations1344–1396、KR3对应：layer1，103帧，初始ts=to/30保持末帧，初始pos_list/scale_list第1组；等待整数2..6后选择同一索引的位置与朝向，ts0非loop播放，dur=103/30，再dur+下一整数wait后重播。六位置153/484、153/528、97/490、210/511、439/553、152/690，对应镜像-1/+1/+1/-1/+1/-1。没有循环播放103帧或自由插值位置。MapAmbient新增非loop ceil/clamp与名义事件时间，独立可注入UI RNG，不声称与Love同seed随机轨迹或掉帧后的timer逐帧完全相同。

原帧的58×60完整图面/trim保持，Canvas在原pos局部translate/scale带符号后按半图anchor绘制，位于背景与under遮挡层之间，点击继续传播；modal时钟继续、destroy清状态，无World实体/战斗RNG/进度修改。湖面loop和window vignette几何保持。tools/sources/desktop-map.json新增103帧声明和原PNG1/4/5 SHA，extract_desktop_map.py仍逐所有裁图RGBA验证，ambient无损紧凑图从444B到4410B，不下载整原图集，全部提取接全量流程。

293Node通过，新增末帧等待/整数边界/成对六位置镜像/重播间隔/大delta名义事件顺序；旧lake纯测试原用整个ambient列表和空ctx，新加入镜像对象后初次ctx.save不存在，已将这个只测lake的fixture限到其自身spec，George用真实transform记录单独覆盖，不弱化产品。实际build test:map-george捕获原drawImage裁图/负scale/帧1、45、103，原书页/modal继续、手机pan与CDP真实入关/销毁；受控UI时钟和截图不是原版同步或天然通关证据。原test:map-ambient、UI、独立天然九模式三战役三星/存档手机均正常exit0，第三战役天然XP4705/20生命，策略与World数值未改。

build957文件54,440,674B；100ms/1.5MBps/cacheoff真实book->battle14,854,462B/14.185s<15MB，不保证所有线上速度。公开本轮一次manifest0.2.79，完整UI正常exit0，新推送后不轮询。最终logs george-tests-release.log/george-browser-final.log/george-ambient.log/george-ui.log/george-campaign.log/george-performance.log，公开george-pages-ui.log。desktop-map-george.png/mobile.png已查看，为当前原素材受控姿态样本；完整地图其他装饰/光效和像素对照仍未完成，整体非1:1。

## 0.2.79 原窗口暗角与湖面闪光

原vanilla screen_map.init302–311与KR3对应411–420均在map之后、HUD之前向window加入map_vignette_small，pos(-2,-2)、scale(1.02*sw/imageW,1.02*sh/imageH)，事件向地图传播。本批用同原400×225图、独立窗口绝对层，随clamped desktop window resize而不继承map-wrap pan；不是CSS渐变。map-ambient.mjs封装window参考几何与展示时钟。原map_animations3的ma_lake_water_sparks在845/503、layer1、anchor半图面、loop1..24/30fps；共享load_map_animations1340与KR3对应均取整数UI随机起始帧/30，再由KUI ceil/zmod循环。动画在背景后、under遮挡图前，modal继续、destroy停止，不调用World RNG或改进度。

原动画声明只读解析，新增24帧与暗角的固定源PNG SHA/声明/共享控制器SHA在tools/sources/desktop-map.json记录，extract_desktop_map.py接全提取。别把map_animations1的船与云误作KR3；KR3实际动画表从7326开始，map_decos3只有山体解锁。本批只恢复湖面一类，其他动画仍未移植。ambient独立无损图集444B、暗角988B，每裁图与原RGBA逐字节验证；未整包预载/降质/提高15MB预算。

首轮新img在scene门调用decode时没有src，导致入图返回saves，已把地址在构造时立即设置，再重构建回归。手机专项还发现overflow:hidden允许scrollIntoView改变viewport原生scrollLeft/Top，暗角相对窗口被偏移；改desktop-map-viewport overflow:clip保裁切和既有transform pan，新增零原生滚动与固定位置断言。首轮入图失败的Node44527清理残留精确TERM收143；远程初轮Node44513也收143，不能称这两轮exit0。独立远程重跑先page.close后browser.close正常exit0。修decode后中间九模式正常exit0；最终clip构建又完整九模式正常exit0。手机早期测试hover使用越出固定游戏视口的y500，改合法y100；拖动后先真实wheel回原点再CDP点旗，无force/改门控。

291Node全过，最终实际build map-ambient/UI/完整九模式三战役三星、存档与手机均正常exit0，3campaign自然XP4705/20生命，World/策略/RNG/金币/HP/冷却未改。专项源帧1/2/24边界与原pos/anchor调用、modal时钟、window/pan分离、窄屏/手机真实触摸入关与旧场景销毁均过；受控UI时钟非原版同步证据。截图desktop-map-ambient.png/mobile.png已查看，是当前样本。冷路径100ms/1.5MBps/cacheoff14,835,833B/15.109s<15MB，无整大atlas/OTF，不保证所有线上速度。

build957文件54,422,045B；公开本轮manifest0.2.78，重复UI最终正常exit0（首次清理残留已如实记录），新推送不轮询。最终log map-ambient-tests.log/browser-complete.log/campaign-release.log/ui-release.log/performance-release.log，公开map-ambient-pages-ui-repeat.log。其他装饰/完整地图光效与Love shader/文字基线仍欠，整体非1:1。

## 0.2.78 原桌面旗奖励串行阶段

新增desktop-map-unlock.mjs独立桌面profile，旧phone MapUnlockSequence保持不变。完整只读交叉vanilla desktop-screen_map MapView.show_flags1640–1770与KR3对应流程：初始wait1；获星disable(false)/.5，非iron gotstar65–89 restart/wait1/campaign端点，新增星每个1–17/.5；转iron前.5/turnIron135–150 restart/hold4/iron端点；heroic前.5/wing1–15/hold2；新道路每点wait.4（纠正旧.3），newFlag1–24/hold1/nostar端点/enable。KR3 map_data的map_decos3只见trigger21，首三关没有对应deco unlock额外等待；KR1 map_decos1的trigger2/3不能误套。本批未执行任何控制器。

phase事件只在边界reset控制器，模式/时钟不被每帧idle sync覆盖，保留原turnIron hold内可能的随机重播。星星出现前hidden，真实KUI ceil(ts*30)/clamp，newFlag也修正旧floor+1并更新错误旧断言。源Start Here在协程结束即创建，.5 in-quad，不再多等.5；原stime+=dt*10，所以轻摆sin(UI时间*5)，DOM文本/Canvas纸张同尺度。按源仅开场难度窗口等待.5轮询，书页/英雄等模态下奖励继续；不再一律modal暂停。UI时钟与World分离，不改真实星/挑战数/XP/金币/HP/冷却/寻路。

已有217,812B transition图只在gotstar/新iron需要时载入，fresh路径仍不取。新增原GuimapNewRoad→Sound_MapRoad.ogg（gain1）在道路首点前排队，APK原件提取/build可复现。tools/sources/desktop-map.json rewardMotion记录源规则，mapHistory/各槽隔离及销毁继续沿现有生命周期。新test:map-start/map-unlock入口指向desktop专项，旧phone browser文件/pure profile仍保留。

289Node全过，新增名义阶段/.4与phone.3隔离、逐星/翼章/输入block、模式phase不覆盖、无变化不载transition及难度轮询；实际最终build奖励/空闲/开始提示/UI/导演/完整九模式三战役三星/存档手机均正常exit0，3campaign自然XP4705/20生命。奖励专项用受控UI时钟抽样gotstar65/66、逐星hidden、道路→newFlag1/2、turnIron与wing，真实点击在动画中拒绝、完成后书页/手机入关，预算未变；这是受控进度，独立天然九模式另过，非原版同步证据。

首轮phase优先表达式括号缺失导致多载iron图，已修并增加phase优先测试。首轮九模式在返回按钮等待超时，修正后完整重跑正常；campaign失败路径新增错误/界面状态诊断。旧idle fixture把“新解锁2”和“2已赢iron”同批设置，源newFlag最后会转nostar，旧白旗期望不成立；改成一致的已完成重入快照，奖励由独立真实阶段专项覆盖，未改产品门控。旧idle等待清理Node42433比daemon86230后TERM收143，不能冒称那轮通过；诊断重跑正常收exit1，修fixture后exit0。开始提示CSS scale字符串仅约六位精度，浏览器断言用1e-6序列化误差，仍验证原sin5与inquad，未改产品公式或跳动画。

最终build954文件54,415,745B；100ms/1.5MBps/cacheoff真实书页入关14,829,899B/14.193s<15MB，无整大atlas/OTF/多余transition下载，未降质或抬预算。公开本轮一次manifest确认0.2.77且完整UI过，新推送后不轮询。最终logs map-reward-tests-final.log、map-reward-browser-release.log、map-reward-idle-release.log、map-reward-start-release.log、map-reward-ui-release.log、map-reward-director-release.log、map-reward-campaign-final.log、map-reward-performance-release.log。desktop-reward-first-star.png/iron-mobile.png已查看，受控UI时刻不是原版同输入证据；其他地图运动层/vignette和字体shader/测量等仍不完全一致，整体未1:1。

## 0.2.77 原桌面旗帜idle/hover与点击输入锁

桌面完整map_flag_0001–0182在已审计atlas中齐全，不能套用phone旧缺帧结论。原vanilla desktop-screen_map.lua LevelFlagView1821–1960与KR3同方法2499–2643声明交叉一致：nostar24–64、campaign90–134、iron160–179、newFlag1–24、gotstar65–89、turnIron135–150。KView.update先加ts，animation_frame905–958用ceil(ts*30)、1..len clamp，默认非循环末帧保持。set_mode非restart ts=1e9，restart ts0；randomWait首次love.math.random(3,10)，严格<0后重新取(3,10.1)并ts0。LÖVE文档说明参数整数取整，10.1取10（https://love2d.org/wiki/love.math.random），浏览器使用独立可注入UI随机，不声称复现原Love随机流/同seed轨迹。

hover停止动画、wait=-1，按nostar/campaign/iron显示180/181/182并原GUIQuickMenuOver；leave从对应首帧重播并重新等待。点击源disable(false) .5后enable，本批保留原图不变灰，非通用button:disabled滤镜。控制器在书页模态下继续UI时钟，奖励时间线保留既有暂停方式，不改变其phone串行时间；destroy主动失效所有旗，旧资源完成不能复活。World/金币/HP/XP/冷却/RNG/解锁/存档预算不改，纯idle不写进度。

原关键图集保留，idle按nostar19,216B/campaign38,112B/iron28,968B独立分组且只加载当前模式，transition217,812B生成但本批不加载（桌面gotstar/turnIron完整奖励协程仍待迁移，不能称全旗动画已完）。每帧独立trim/size与sheet，像素重复裁图共享位置，所有263个所选帧逐一与固定PNG源解码RGBA验证。整atlas实验会增关键下载，最终不采用整包加载/不调15MB预算；背景/原关键图仍无损。tools/sources/desktop-map.json记录动画声明/方法/原共享段SHA，extract_desktop_map.py接全提取。

285Node全过，新增ceil边界/严格等待重播/hover离开/模式切换/.5输入锁/销毁与全182帧分组。专项真实pointer hover/leave/随机重播、modal下锁结束、冷路径仅nostar、只读存档、三个真实模式、手机CDP入关与销毁，模式进度为受控fixture非正常通关证据。原desktop-map专项首次全部断言后Node39716残留，比daemon86230精确TERM收143，不能冒称exit0；测试补detach CDP/先关context，最终正常退出。手机截图首次取在原书页alpha0，已改等原open终点后取样，不跳动画。

最终build952文件54,406,726B；实际build旗专项、desktop-map/UI/导演和完整九模式三战役三星/存档手机回归正常退出，第三关自然XP4705/20生命。冷路径100ms/1.5MBps/cacheoff14,825,363B/14.239s<15MB流量预算，只加载nostar小组；不是所有线上速度保证。公开本轮一次manifest0.2.76且UI通过，新推送后不轮询。最终logs flag-idle-tests.log、flag-idle-browser-release.log/flag-idle-browser-screenshot-final.log、flag-idle-map-release.log、flag-idle-ui-release.log、flag-idle-director.log、flag-idle-campaign-release.log、flag-idle-performance-release.log；map-flag-idle-modes.png/mobile-book.png已看，受控7星模式样本非原版同输入逐帧证据。

既有MapUnlockSequence奖励串行时间仍沿phone实现，newFlag揭示仍走旧desktopMapFlagFrame帧选择，获星/turnIron尚未使用完整新桌面transition组；本批不把idle恢复说成完整桌面奖励协程完成。地图其他运动层/船/vignette也仍待迁移。

## 0.2.76 原四象限选塔/预览/升级/集结范围

原game_gui1950–1974 show_tower_range用decal_tower_range/decal_rally_range，pos=实体+tower.range_offset；4sprite按奇偶x正负、前后二个y正负，scale.x=±range/actual_radius，scale.y=±ASPECT*range/actual_radius。原constants ASPECT=.7，模板actual_radius137、anchor1/0、alpha255、z3500、原range_circle/rally_circle图已在go_decals，非CSS猜椭圆。模板没有range显隐Tween，1975–1984 hide直接移除，展示层按同即时语义派生，不插World实体/消耗RNG。

原3117–3279 show先清所有范围，仅attacks.range显示当前塔；空holder无范围，兵营初选也不画攻击圈。3513–3608第一次tw_upgrade读取action_arg；preview先经build_name，再用attacks.range画upgrade或barrack.rally_range画rally。当前攻击圈与升级圈同时保留；切到sell移除upgrade。3643–3734集结命令直接用当前barrack.rally_range，Escape/取消/通知/暂停/场景清理后消失。选中派生数据只读World本局模板（含已买天赋），不改射程/伤害/金币/XP/冷却/寻路。

新tower-ranges.mjs/range-data.mjs与extract_ranges.py/read_range_rules.lua可复现原声明。四象限单独Canvas transform独立处理x/y，避免现有entity单标量缩放不适合该模板；沿同textureScale/game_scale/相机绘制。原z3500保留元数据，当前在单位/效果之后的专门绘制阶段，完整所有sprite全局z排序仍未恢复，不能称所有遮挡逐像素一致。其他技能瞄准圈/出口圈未在本批改写。

首轮browser发现真实空slot.key为null、原模板在source.template，已修读取并把纯测试改成真实结构，不改World。修正前范围/预览/九模式失败结果保留，修后重构建重跑。281 Node通过，新增三项holder无圈/四build_name与当前升级rally分支、四象限anchor/alpha/比例且模板不变；不因纯fixture通过跳浏览器。

实际最终build范围专项、原preview专项（含真实首波塔通知/敌通知）、UI及完整九模式三战役三星/存档手机均正常exit0，第三关自然XP4705/20生命。新专项从真实Canvas sprite调用记录四象限，覆盖无钱可预览不成交、买70/升110/准备全退180、兵营rally、缩放、暂停/场景清理；解锁stage3与零金币是UI受控fixture，独立九模式天然XP链另过。一次新专项读取上一个RAF的range_circle而误断言兵营rally_circle，已等待新类型完成绘制，未改产品。范围升级图取样是准备期塔仍建造中的当前状态，不能当原版同镜头。

build947文件54,081,746B；100ms/1.5MBps/cacheoff冷路径14,785,872B/15.173s<15MB流量预算，无新图下载（原go_decals已预载），未调预算/降质。公开Pages一次manifest确认0.2.75且完整UI通过，新推送后不轮询。最终log ranges-tests-final.log/ranges-browser-final2.log/ranges-preview-final.log/ranges-ui-final.log/ranges-performance-final.log/ranges-campaign-final.log；tower-ranges-upgrade.png/mobile.png已查看，当前取样非原版同步像素证据，整体未1:1。

## 0.2.75 原桌面难度选择连续分支

原共用desktop-screen_map DifficultyButton6479起/DifficultyView6689附近与KR3混合源对应只读比较：wide1380×720、原四张340×420插画/三层框、kr3_title_bg，卡中心690+(2i-5)*162.5/y340，按下.98、hover原框与glow，原h46标题/body20说明，标题/底部提示原坐标。只取固定源声明与PNG SHA验证原图，新增9图均无损RGBA验证；设置资源保持独立lazy，不进入首图关键下载。原共用源第四档解锁条件与mod改成已有一关不一致，未复制mod条件/玩法。

设置难度原hover颜色214/189/131→255/223/0，点击先关闭设置再打开独立难度页。前三档选择调用现有存档difficulty与persist，关闭后回地图，书页/入关沿既有真实参数；第四档始终disabled，完整第四档玩法仍未实现。第四栏使用原通用难度说明，避免“完成战役即可解锁”误导当前支持范围，不为 UI 加第四档数值。Escape取消不改难度；旧设置关闭Promise若被新窗口取消则不续开，版本/modal双检查。原.5/.25 PopUpView与50逻辑位移沿用，难度720高度、设置570与书页720分开。

文字shader/阴影/垂直基线和description测高仍浏览器近似，原图不等于逐像素验收。World/HP/金币/XP/冷却/策略未改。278 Node全过（新增支持范围拒绝4与原四栏坐标）；构建包真实鼠标hover/.98按下、1/2/3保存、重载、Escape不变、更换窗口取消旧续接、手机CDP选择后真实入关difficulty2通过。早期测试未设置TEST_URL时误连停用8765而失败，已明确8766实际build重跑，不启动旧web冒充构建。首次专项断言完成后Node多等待，拟TERM时已自然退出，kill no such process，session最终正常exit0；不冒称被杀/跳清理。最终专项显式detach CDP并先关context。

最终build945文件54,076,831B；冷路径100ms/1.5MBps/cacheoff14,781,239B/15.058s，15MB流量预算保留，没有整大atlas/OTF下载。公开本轮一次manifest0.2.74且完整UI通过，推送0.2.75后不轮询。最终日志difficulty-tests-final.log、difficulty-browser-release.log、difficulty-ui-release.log、difficulty-performance-release.log、difficulty-campaign-release.log；原音量设置专项difficulty-options.log同批通过。desktop-difficulty-native.png/mobile.png已查看，为当前正常UI取样非原版同步像素证据。

完整九模式首次构建回归difficulty-campaign-final.log正常exit0。最终仅第四栏说明由解锁承诺换原通用说明后再构建，九模式/存档/手机断言与browser-results.json均完成，Chrome已退出但Node36139残留，比较daemon86230后精确TERM并收143；该release清理不能称exit0，没有删除断言或伪造成功。三战役最终均三星、第三关自然XP4705/20生命，World与策略未变。

## 0.2.74 地图原 OptionsView 与真实全局音量

地图设置改为原720×570 options_bg_notxt、12张独立原图与原desktop角色，固定公开源/PNG SHA在 tools/sources/desktop-options.json，extract_desktop_options.py 无损裁图逐RGBA验证并接全量提取。标题/存档页设置不迁移。原共用OptionsView6264–6500与VolumeSlider/GGOptionsButton/GGPanelHeader交叉核对：SFX滑杆149/167、音乐149/254、422×34、填充396×15；原thumb60×60。标题和按钮按原角色/物理字号取整与宽度fit，shader/基线仍CSS/浏览器近似。公开旧调用签名与新版slider style接口不同，按实际音乐/SFX样式分支选原帧，不执行控制器。

滑杆真实控制已有及新建Audio gain，原基准.2和效果gain保留；0..1的volume_fx/music独立全局保存。未配置的旧布尔默认行为保留，首次滑杆捕获旧有效状态；配置后跨存档全局有效，不被新槽默认sound:false压成0。原thumb拖动/hover/down、pointercancel、键盘操作可用；关闭保存，退出立即清理再走既有门，返回/Escape原.25关闭。BookMotion显式570高度使50逻辑位移正确，书页默认720与.5入/.25出不变。pending请求/version/slot校验、重复close与旧回调取消已覆盖。

完整难度子页未迁移，本面板只读显示真实支持三档当前值，不造第四档玩法。World/HP/金币/XP/冷却/策略未改。276 Node通过；最终build原设置专项、顶部设置入口回归、UI、完整九模式三战役三星/存档手机通过，书页动画及导演专项同批通过。首次新槽测试发现全局音量被旧默认静音覆盖，已修真实优先级并重跑；旧顶部专项同步等待不适用于lazy资源/关闭动画，已改真实等待，不改门控。

最终936文件53,663,277B；冷路径100ms/1.5MBps/cacheoff14,764,752B/15.033s，15MB流量预算保持，无options图片进入关键下载，不是线上速度保证。公开本轮一次manifest确认0.2.73且UI通过，推送新版后不轮询。最终log options-tests-complete.log、options-browser-publish.log、options-hud-publish.log、options-campaign-publish.log、options-ui-publish.log、options-performance-publish.log；desktop-options-native.png/mobile.png已查看，为当前UI样本非原版同步像素证据。整体仍未1:1。

## 0.2.70 原书页交互与 PopUpView 时序

重新核对固定版本共用原代码 `all-desktop/gg_views_custom.lua`，不是混合模组的修改版：原 `FADE_IN_TIME=.5`、`FADE_OUT_TIME=.25`，show在开始就 `enable(false)`，并非动画结束才启用。模组的1秒/0.5秒与延后启用未采用。来源和SHA保存在 `tools/sources/book-motion.json`，控制器仅只读，未执行。

`book-motion.mjs` 独立驱动书页：初始y=-50/alpha0，以out-quad到y0/alpha1；背景黑色alpha80以in-quad到160。关闭从当前y再上移50、alpha到0，背景以in-quad到1，0.25秒后才隐藏；关闭立即inert并保持遮罩拦截，重复Escape不重启计时。打开立即可操作，半程切模式保留原父动画，选中页签为无动作状态。全局phone菜单/战场loading/director时序未重写；入关交接沿用既有立即关闭书页、由loading门管理输入的路线。关闭、重开、替换对话框、切场景均有动画所有者与取消保护，不能让旧hide回调隐藏新窗口或新存档；减少动态偏好使用静态终点。

关闭按钮补齐normal/hover/pressed三图；入关与关闭点击补原GUIButtonCommon。模式页签补原normal/hover/selected帧、hover文字95/59/38与normal198/134/95、selected142/213/246。难度点击后显示新难度的hover图，实际pointerleave/cancel/blur后恢复normal，不为旧测试保留错误回弹。原 `GUIQuickMenuOver` 已从APK声音声明核实为 `Sound_GUIMouseOverTowerIcon.ogg`、gain1，独立提取为book-hover，构建可复现。所有状态均为展示层，不改World、金币/XP/冷却/RNG。

264项Node，实际build的book-motion、level-book、desktop-book、UI与完整九模式（三战役三星/存档/手机）通过。专项核对0/250/500ms及中断关闭0/125ms的真实DOM位置/透明度/背景、即时启用、关闭输入阻止、重复Escape、半程真实点击切页、hover音效与图、旧hide取消、通用对话框替换、slot2隔离、减少动态偏好和手机真实tap。前批字体及九页布局回归保留。背景的controller浮点值单独精确断言，CSS序列化按8位alpha核对，未用取整差异改变产品插值。截图为当前受控展示/实际hover及手机取样，不是原版同输入逐帧像素证据。

冷路径100ms/1.5MBps/禁缓存含真实开书页和入关，14.69秒、14,585,058B，低于15MB预算；该总时长包含原入场动作及自动化等待稳定，不是所有线上设备速度承诺。锁定页签原悬停说明、蜡封文字shader、Love字体细节、desktop地图与其余全局差异仍待对齐，整体未达1:1。

## 0.2.69 桌面双页书框、皇冠首字与模式书页

本批找到带 Origins desktop 图集的公开社区模组仓库 `zidonghua2018/KingdomRushFL`，固定提交 `a1facc6b76d00b064ad43db958d31b4ceaf7388d`。只提取经过视频同关画面核对的书页图片与九个书页短标签，不导入模组控制器、游戏模板、数值、改写后的字体映射或新增功能。起初核对的 KR1 图集首字饰板不符，未采用；最终采用 KR3 皇冠饰板、金色书框和前三关矩形预览图。`tools/sources/desktop-book.json` 记录选中声明、原图集 SHA256、来源与帧坐标；`extract_desktop_book.py` 输出 52 张保留 trim/完整 size 的无损 WebP，并验证解码 RGBA 一致。此来源是社区仓库中的 desktop 图集，不能改写成当前 phone APK 的内容。

`desktop-book.mjs` 独立恢复 1202×720 书页坐标与 screen_map 自有 1920×1080 参考窗口。这里 desktop 纹理 ref_res=fullhd1080，图片逻辑尺寸直接为元数据 size，不经过 NativeUI 的 phone UI 0.5。共用源 `add_level_title`/`add_level_description`/`add_level_tab`/`LevelSelectView` 与实际画面对照：左标题中心394/y126，右标题中心870/y104，原花纹、首字皇冠690/120、56号 JIMO 首字、154起始窄栏/下方宽栏、342×246预览、五枚徽章、1105处三个模式页签、805/470蜡封与982/522难度钱币。保留真实入关/难度/存档与三种模式规则，锁定挑战页签不可点击；旧测试对应改为检查禁用，未放松战役三星解锁。英雄/升级上限与钢铁禁塔展示读取现有真实本局规则，不复制模组规则。

JIMOJW 与前批已取得原字体 SHA 一致，但源文件 `vhea` 版本1.1被 Chromium OTS 拒绝，表现为 FontFace 加载失败；本批只去除 `vhea/vmtx` 竖排表，逐表验证 `glyf/loca/hmtx/hhea/cmap/OS2/字体 hinting` 的横排内容字节不变，分别记录 source SHA 与 browser SHA。发布时只 subset 书页实际首字与“进入战斗”，WOFF2约20KB，按需加载，不增加启动五字体门。没有替换成系统字体或导入模组 HarmonyOS 字体。蜡封文字仅按原特定 shader 参数做 CSS 近似，未给全局中文随意描边。

261项 Node、实际 build 的 desktop-book/level-book/font/UI 专项与完整九模式三战役三星通过；真实新存档第三战役XP4705、20生命。专项覆盖九页原文/皇冠首字与窄宽栏顺序、原图尺寸/桌面坐标、锁定页签、真实切换/难度保存、Escape/关闭重开、ResizeObserver手机缩放、两字体部署字形与横排原件 Canvas 像素/metrics 一致。前批字体请求延迟取消回归保留。冷路径含真实开书页与点击入关，100ms/1.5MBps/禁缓存14.15秒、14,580,610B，仍低于15MB；这是受控本地数据而非所有线上设备承诺。

当前桌面/手机截图均已检查，解锁进度是UI受控样本。仍有旧 phone 地图背景与 desktop 视频不同、书页开关动画、蜡封 shader、Love 字号取整/基线与完整单位/UI等差异，尚无同输入逐帧像素验收，不能称整体1:1。首版浏览器失败确认为原 JIMO 竖排表拒绝；另两次专项分别在小于0.02逻辑像素的浏览器坐标量化、ResizeObserver尚未交付时失败，已按实际亚像素精度与真实观察器等待修正，最终完整通过，没有强制点击或改变游戏数值。

## 0.2.68 用户截图对应的关卡书页字体

用户截图与指定视频 BV1y8411R7iB 第八段、第 7 秒的第三关书页直接比较后，确认此前“APK 字体文件相同即可证明画面正确”的判断不成立。当前 APK 是 phone 方案，而视频展示 desktop 书页；普通粗体 `h_map` 不能充当视频里的书法书页标题。

本批单独增加 `OriginsBook`，用于关卡名和模式标题，取消自加的关卡数字前缀。字体来源明确记录为公开 Frontiers desktop 共用源码的 `h_book` / Sun Yun He Xuan Li Ti，固定提交 `cf90f0d68002491e705505fdeec346c0e803a97a` 与 SHA256，见 `tools/extract_book_font.py`、`web/assets/fonts/book-source.json`。这是跨版本 desktop 共用来源与视频字形的对照，不能写成当前 Origins APK 提取件，也不能据此证明所有字体角色相同。其他 APK 字体角色保持隔离，正文仍用共用源码指定的 Noto CJK，不凭观感换宋体。JIMOJW 首字字体虽已找到，但缺少对应桌面装饰图，本批不画假的首字饰板。

正文收紧 HTML 空段落与行距，标题/模式/正文分别定位；在现有 phone 背景内为大关闭按钮留出正文间距，这是兼容当前背景的排版修正，不是恢复完整 desktop 坐标。难度恢复 phone 模板原位置与六张 normal/pressed 图（其原设计就是三种人物头像），真实循环切换、立即保存，移除浏览器原生 select。全局 World、价格、经验、伤害与冷却不变。

书页字体只在打开书页时加载，不加入启动字体门；加载完成后才绘制，Escape、关闭、其他对话框和换场景使旧请求失效。构建继续生成保留原轮廓/metrics 的 WOFF2。258 项 Node、最终 build 书页专项/真实 Escape 取消/三难度循环与重载/九种说明无溢出/手机/源字体与部署字体 Canvas 像素和 metrics 一致、完整九模式（三战役三星）与 UI 通过。加入真实开书页操作后，受控 100ms 延迟、1.5MB/s、无缓存全路径 14.11 秒、14,529,290B，低于 15MB 预算，不是线上所有设备的速度保证。

当前截图仍是实现取样。双页书本、首字饰板/花纹、完整 desktop 模式布局、Love 测高/基线仍待恢复；本批不能称整页或整体像素一致。

## 0.2.36 原英雄地图提示与入口

核对screen_map.lua:631–636、1670–1727、2306–2314：新解锁第二关优先升级提示；否则默认艾莉丹经验严格大于1300且未seen时，展示并立即保存英雄升级提示，再考虑新英雄。当前未实现全局天赋，因此新第二关不添加假的升级按钮，也不越过原优先级显示英雄提示；重入后可正常提示。原hero_data_free确认埃里汎第三关解锁，当前角色尚未实现，故不展示无法兑现的解锁入口，保留明确差异。

从原bottom_right_bar_view提取337/68锚点、329×78父尺寸及hero/encyclopedia子坐标，恢复实际英雄肖像、原按钮中文、真实剩余技能点标记；数字用原Comic Book Italic.ttf。界面按phone参考高度320缩放，并恢复0.5秒out-back入场。升级气泡复用原九片/字体，挂在固定界面父层，拖地图不会漂移；按原0.4秒淡入和1↔0.98脉冲，点击英雄殿堂0.4秒淡出。已读保存在seenMapHints，与战斗always通知分开。

183项单测、九模式完整浏览器（三战役三星）通过；完整新存档伤害经验链另断言英雄提示已读记录确实产生。单测覆盖严格XP边界、原优先级/已读/支持角色、淡入脉冲与中途淡出。浏览器专项覆盖原文、已读保存、实际训练扣点、地图固定层、重入/刷新和手机边界，UI专项通过。当前文本测高/换行和源字体shader仍为浏览器近似，截图不是原版同步证据；整体未达1:1。

## 0.2.35 首次地图与原开始气泡

核对screen_map.lua:337–1377初始化：无last_victory且levels为空才建立首关记录并令unlocked_levels包含1，立即保存。地图协程完成首旗1秒展示后，再等待0.5秒显示开始气泡。新增mapInitialized存档展示标记，首次空进度地图传previous=0，重入或刷新不再落旗；只有第一关可用时仍按源重新显示提示，不用“已读”永久压掉。旧版没有该标记的未通关存档无法还原此前地图访问历史，第一次升级后会建立标记。

原map_balloon_start_here_view坐标104/107、max_size120/0、one_line/centered/callout-center-bottom，中文“从此处开始！”。共享balloon.mjs抽取原GGBalloonView九片/箭头/角色字体几何，地图使用640坐标容器，战斗引导保留原693空间。按gg_views_custom.lua:464–478的0.4秒淡入显示，没有套用战斗TutorialBalloon的缩放呼吸。提示本身不接管点击，选关面板自然覆盖，离开地图随场景清理；解锁第二关后不再显示。

180项单测与九模式完整浏览器（三战役三星）通过；首旗、保存标记、删除存档重建、重入/刷新、淡入、原文、选关与手机专项及原战斗guidance专项通过。手机实测截图已检查，仍为当前实现而非原版同步证据。字体测高/单行fit使用浏览器原字体近似，旗帜仍有已记录的新旧图集兼容差异，整体未达1:1。

## 0.2.34 原地图尺寸、定位与串行解锁

核对screen_map.lua:2433–2622及phone初始化：phone参考480×320，地图640×510，缩放clamp(1,2,sw/map.size.x)，不能像旧实现始终缩小到屏幕宽。恢复原最小缩放、横纵向拖动与方向键边界。初始化直接将新解锁或最后可用旗帜居中并限制边界，源代码这里没有镜头tween，故没有凭空添加滑镜。

MapUnlockSequence按原协程先等1秒，再逐关串行处理奖励：战役先0.5秒、非钢铁旗gotstar等待1秒、每颗新增星间隔0.5秒；钢铁/英雄各先0.5秒后展示，分别等待4/2秒。当前关奖励完毕才开始新道路（点数×0.3秒），随后新旗1秒，结束才启用。新增星和挑战用原GUIWinStars，新旗用原GUIMapNewFlah对应Sound_MapNewFlag.ogg。展示随机不占World；没有新增进度时旧道路/旗帜静态显示，不重复发声。

177项单测、九模式完整浏览器（三战役三星）与UI/手机检查通过，覆盖尺寸、居中边界、星→路→旗、挑战等待和无新进度。实际Canvas专项检查各时间点、声音只发一次、重返不重播和手机居中/横向键盘；地图拖动专项通过。地图旗帜仍使用已明确记录的兼容图集，gotstar/iron缺少LevelFlag3View原新版帧，不能因串行时序修正而称旗帜画面1:1。手机安全区、字体shader、完整敌状态等仍未完全对齐，整体未达1:1。

## 0.2.33 原加载门与串行入关

核对all-phone/screen_loading.lua:34–150与director.lua调度：原transitionDoor两片镜像、transitionLoading左右纹章，0.3秒in-quad关门，0.7秒关闭交接；等待新场景初始化和首次绘制，再0.3秒out-quad开门，0.4秒恢复输入。关闭交接点停止旧音频，播放原GUITransitionClose/Open音效。loading_common原图集加入可复现提取与构建。

SceneTransition将地图入关、战场返回地图及重试串行化：关门前保留原场景，关闭后加载，完成后才打开；期间暂停世界并屏蔽指针和键盘。重复请求拒绝；取消用事务代号使迟到回调失效，Renderer.loadLevel也在提交map/data前验证代号，防旧图片覆盖新关卡。失败恢复地图并退出门层。开场教程在门完全打开后按原always策略正常展示，没有全局跳过。

172项单测与九模式完整浏览器（三战役三星）通过。专项检查慢加载关闭保持、重复请求、取消旧回调、失败恢复、返回地图、手机，并实际检查门素材画面。截图为当前实现取样，没有原版同输入逐帧对照。标题/存档之间仍为已有面板切换，地图镜头移动和全场景过渡没有全部复现；源字体/安全区/完整敌状态等差异也仍在，整体未达1:1。

## 0.2.32 鬣狗临时脱离拦截

核对game_scripts.lua:8728–8772与utils.lua:1061–1069：鬣狗被有效守军拦住时，清守军目标和blockers，临时禁止拦截，速度乘原coward_speed_factor=1.5，持续原coward_duration=1.2秒。严格超过持续时间才除回原倍率，恢复可拦截；不会持续刷新或叠乘。正常使用walking，脱离阶段用running方向帧。原协程没有近战分支，因此去掉此前一般敌人流程错误造成的最低1点伤害与攻击动作。既有远程投射物仍可命中它。

169项单测、九模式完整浏览器（三战役三星）通过，覆盖真实World步进、脱离、重复拦截不叠乘、到期与再次触发、不产生近战命中。Canvas专项由真实World状态驱动，确认原hyena_runningRightLeft帧和解除后的walking；截图是受控状态，不是原版同步录像。第三关合法策略调整防空/地面火力购买顺序，避免依赖兵营永久拖住鬣狗，没有改敌人HP、速度或原技能冷却。完整拦截槽位/寻敌时序、眩晕状态和非零安全区等仍不完全一致，整体尚未达到1:1。

## 0.2.31 咬噬者聚集增伤

核对 game_scripts.lua:14438–14468、utils.lua:714–738 和原 modifier：每0.25秒统计100半径、0.7椭圆内符合vis过滤的活敌人，包含自己及其他种类。达到4个时只给来源咬噬者自身1.5倍伤害，持续1/3秒；刷新不叠乘，保留原火焰动画起点。伤害在真实近战命中时读取倍率，离群后到期解除；未更改血量、护甲或基础伤害。Renderer只绘制包内mod_gnoll_gnawer帧，不负责结算。

165项单测、九模式完整浏览器（三战役三星）及实际增益Canvas专项通过。新存档无训练经验链保留领域回归；浏览器第三关使用正常赚取的点数训练二级万箭齐发，策略按训练状态选择购买顺序。测试覆盖计数/自身目标、周期、椭圆、死亡排除、刷新与解除、命中伤害，以及实际World驱动的Canvas增益/到期画面。截图为受控场景，尚无原版同输入逐帧对照。原完整路径节点有效性、鬣狗绕过拦截和其他敌状态仍待恢复；本批不宣称完整敌行为或整体1:1。合法通关策略调整购买顺序应对新增源规则，没有削敌或增加金币。

目标是前三关九种模式的精致原版还原。0.2.0 的可通关验收不足以证明 1:1，0.2.1 与 0.2.2 分别是动画和原版界面修正批次，不能作为整体已完成的声明。

## 本批次依据与修正

依据用户提供的 5.8.02 APK 中原始模板、动画表及 LuaJIT 字节码，并查看已有第一关实机视频片段。没有把小尺寸预览帧当作逐像素标准。

| 对象 | 原始依据 | 这次行为 |
| --- | --- | --- |
| 施工 | `tower_build_*` 模板 | 原版施工台、进度条；0.8 秒后完成 |
| 兵营门 | `tower_barrack_*_door_open/close`；`scripts.tower_barrack.update` | 30 fps 打开五帧、保持 0.5 秒、关闭四帧；门打开后士兵才从建筑坐标出发 |
| 队形 | `utils.rally_formation_position`、`point_on_ellipse` | 半径 25，纵向比例 0.7，第一人位于 -π/2 方向；移动使用模板速度 75 |
| 步行、攻击、死亡 | `soldier_barrack_[1–3]` 动画表 | 各自使用正确帧段；修正角度映射错误覆盖动作的问题；攻击与死亡不循环 |
| 近战与射箭 | 模板 `hit_time`、`shoot_time` | 挥剑、射箭在 5/30 秒发生，而非起手立即命中；射箭最小射程、脱战恢复采用模板数据 |
| 升级与补员 | 士兵健康与兵营模板 | 升级保留位置和血量比例；尸体有死亡动画；14 秒后从营门补员 |
| 双射手 | `scripts.tower_archer.update` | 两名射手轮流起手，使用各自弓的位置；五帧后放箭 |
| 法师 | `scripts.tower_mage.update` | 双弹在 19/30 秒同时从左右手释放；不再人为错开 0.15 秒 |
| 投石手 | `game_scripts.tower_rock_thrower.update` 与动画表 | 恢复 48 帧装填和投掷动作，九帧后飞出石块，装填石块层只在装填时显示 |
| 操作与声音 | 原版 GUI 和音效图集 | 圆环式建造、升级、出售、集结点图标；营门、兵营应答、交战音效 |
| 动画格式 | 原始 `game_animations` | 支持连续段、跳跃帧段、显式帧列表；修复英雄射箭跳跃帧段被截断 |

## 可复查证据

- `npm test`：97 项测试，包括动作帧、攻击落点、施工、补员、升级和全部九种模式完整通关。
- `npm run test:browser`：九种模式、三个存档位、模式解锁、升级出售、暂停、手机横屏、无异常或缺失帧。
- `node tests/barracks-visual.mjs`：在真实浏览器中输出 180 帧，检查建造、开门、出营、接敌、死亡与补员。需先运行 `npm start`。这是有控制的动画检查场景，会安排敌人与死亡时刻，不是无修改通关录像。
- 通关策略只调整合法建造和施法操作；没有为了测试修改敌人血量或额外增加金币。

## 0.2.2 原版界面与特效

从原 APK 的 `kr3-phone/data/kui_templates/` 导出 7 张布局表，并以原始 `size` / `trim` 还原 200 张界面精灵的完整画布。布局使用 693×320 参考空间和原始锚点，`web/ui.mjs` 负责换算，不参与战斗规则。

- 开始：原版中文悬链按钮、标志与设置入口；存档：原版木框、三个槽位、删除页签和关闭按钮。
- 关卡选择：原版纸面、圆形地图缩略图、放大镜、模式树牌、星级印章和开始按钮；仍保留三模式锁定规则。
- 大地图：保留完整地图，支持拖动、滚轮及上下方向键浏览；未解锁位置使用原版圆点，当前关卡使用高亮旗帜；顶部统计、英雄/百科/设置使用原素材。
- 设置、暂停：原版面板、镜像九宫格边角、关闭按钮与独立音乐/音效开关。手机横屏已检查面板边界，没有越界。
- 结算：原版胜利徽章、对应星级精灵和悬链按钮；失败面板也使用原版九宫格素材。
- 雷电与箭雨：光柱、爆炸半片镜像、落地纹理、英雄箭簇与烟尘改用原动画素材。此项只修正表现；原型技能的伤害及调度规则尚未完全对齐原版。

`npm run test:ui` 检查按钮按下/松开图、地图滚轮与拖动、挑战锁定、九宫格实际边界、音乐/音效开关及手机面板。`npm run test:effects` 检查特效起手、命中、结束三个时刻没有缺失帧。截图前等待图片解码与界面动画结束；这些检查不能替代逐像素原版对照。

## 0.2.3 技能时序与战斗几何

依据 `game_scripts.lua:16412–16609`、`3027–3108` 和 `utils.lua:126–131 / 984–1008` 的字节码核对，新增独立的 `SpellTimeline`：

| 项目 | 当前行为 |
| --- | --- |
| 雷电 | 70 秒冷却，三次独立打击；后两次相隔 0.2–0.4 秒并重新选敌；每次对半径 100 的椭圆范围逐敌随机造成 50–90 真实伤害 |
| 箭雨 | 技能零级 40 秒冷却；中心节点与前后六节点产生 13 支箭，分批发射；每支速度 1500，抵达后对半径 35 椭圆范围造成 20 真实伤害并短暂减速 |
| 技能升级 | 角色等级与技能等级分离，角色升至 10 级也不会自动升级箭雨；全局天赋未实现，不默认开启强化雷电 |
| 同步 | 光柱、落地爆炸与真实伤害同事件；箭簇直接绘制战斗中的飞行对象，落地纹理保持 1 秒后淡出；暂停冻结飞行、命中和冷却 |
| 射程 | 塔与兵营远程攻击、近战寻敌及范围爆炸使用原始 0.7 纵向比例；塔射程中心应用模板偏移 |
| 近战 | 三人分配不同槽位，使用敌人/士兵的原始偏移和第二、第三槽的 ±6 纵向错位；敌人每步只推进一次攻击冷却，并按原始 hit_time 结算 |

`node tests/spells-visual.mjs` 可录制带模拟时钟、打击计数的 120 帧受控检查：目标使用原始属性，但人为固定位置以便观察，不是无修改通关录像。

70 项测试含技能的实际伤害时刻、重新选敌、13 支箭抵达、独立技能等级、暂停、三人站位，以及英雄等级随存档变化后的通关。九模式浏览器回归通过。测试布防补充了防空与兵营升级，未修改敌人数值或发放额外金币。

## 0.2.4 怪物朝向与建塔圆环

用户指出怪物倒着走，核查确认是渲染错误：原始 `gnoll_reaver`、`hyena`、`perython` 等侧身帧默认朝右，而旧代码把 `dx > 0` 设为镜像。原有通关与缺失帧检查均没有检查朝向，不能据此证明画面正确。

- 依据 `utils.lua:245–313` 的角度映射，向右不镜像、向左镜像；上/下方向使用对应原帧。恢复 45° 分区与模板的 10° 转向保持，避免拐弯处抖动。方向缓存属于 Renderer，不修改模拟或存档。
- 依据 `all-phone/game_gui.lua:3117–3279 / 3281–3315`，圆环从 0.6 倍、透明度 0 展开至正常大小，收起反向播放；两者均 0.12 秒、`out-quad`。菜单关闭期间停止接收输入，快速换点会取消旧动画；系统要求减少动态效果时即时切换。
- `npm run test:directions` 在九种模式的真实路径上采样 8,370 次绘制，检查实际动画帧与镜像参数；浏览器检查菜单 0 / 60 / 120 毫秒的缩放与透明度，以及关闭、重开和减少动态效果。
- `RECORD=1 npm run test:directions` 输出 120 帧检查片段：推进第一波的真实单位，手动固定菜单动画时钟以复现展开/收起。它是受控展示，不是原版与复刻同镜头逐帧对比。

70 项单测和全部九模式浏览器回归通过。本批优先修复用户新指出的可见错误，英雄经验和技能训练仍未实现。

## 0.2.5 英雄与交战动作

核对 `hero_elves_archer` 模板、`game_scripts.lua:2725–3017`、原始动作图集后，继续修复同类可见错误：

- 艾瑞丹的移动镜像按实际目的地方向更新；射箭、近战面向真实目标，待机保留方向。移动与攻击分别记录动作起点，不能用移动目的地推导射箭朝向。
- 普通射箭在第七帧出箭，使用原始弓口偏移 `(±9, 28)`、英雄专属箭图和 0.5 秒飞行时间；新移动指令会取消尚未发出的箭。射程采用模板最大值 215、最小值 67.5 与椭圆范围。
- 基础近战使用原始生命、护甲、伤害、1 秒攻击冷却和第七帧命中，加入接敌站位、弓剑切换、持剑待机。武器切换与起手期间仍维持拦截，敌人的攻击冷却继续推进。
- 入场使用原始亮光动作；死亡不再瞬间消失，播放倒地、两秒后显示墓碑，依据模板 15 秒死亡等待后播放复活。脱战恢复改读角色等级的原始恢复量。
- 敌人近战与远程动作分别记录；纵火者近战不再误播投掷。攻击面向实际守军，并按各自原动画长度播放一次，死亡保留动作方向。

`npm test` 84 项通过，新增英雄出箭/命中落点、移动打断、朝向、死亡复活、纵火者动作区分与起手期间拦截检查。第三关另覆盖英雄 3/4 级与 1/15/45 帧准备时间。完整浏览器回归通过九种模式和全部挑战解锁，三个战役均三星；测试策略补充防空、调整正常预算内的布防，并减少打断英雄动作的移动指令，没有调整敌人血量或额外金币。

`npm run test:actors` 检查 11 个真实 Canvas 姿态的帧与镜像，无缺失帧。`node tests/actors-visual.mjs` 输出 240 帧（8 秒）诊断片段：使用真实 World 和 Renderer，但固定目标移动速度，并缩短墓碑/复活等待便于查看。这不是原版同镜头对比，也不是无修改通关录像。

英雄经验、技能训练、闪避和进阶主动/被动技能仍未恢复；普通箭的预测弹道和敌人火把的飞行/伤害调度也仍有简化，不因本轮动作修正宣称这些已完成。

## 0.2.6 英雄经验、训练与殿堂

依据原始 `kr3/game_settings.lua`、`systems.lua:1156–1178`、`script_utils.lua:586–663`、`game_scripts.lua:2725–3017` 和 `screen_map.lua:85–158 / 4253–4275`：

- 移除按通关关卡编号提升英雄等级的逻辑。普通英雄箭/近战以实际结算伤害乘 0.62 排入经验队列，技能使用自己的经验参数；攻击动作结束后按原规则结算整数经验，玩家移动指令优先完成。
- 累计经验阈值为 1300 / 5300 / 11300 / 19300 / 31800 / 46800 / 64300 / 88300 / 115300。难度倍率为 1.9 / 1 / 0.9 / 0.9，并另外应用关卡预期英雄等级的上/下调倍率。角色升级刷新原始属性、恢复生命并播放原升级动作和音效。
- 技能点总额与等级分离：1–10 级分别 0 / 4 / 8 / 12 / 16 / 20 / 24 / 28 / 32 / 36 点。训练按 `hr_cost` 逐级扣点，可重置；不会随角色等级自动强化技能。
- 本批开放 **箭矢风暴**、**双重打击**。箭矢风暴训练三级分别 17 / 21 / 25 支箭、每支 31 / 42 / 60 伤害；双重打击三级伤害 40–80 / 70–140 / 100–200，11 秒冷却，第十四帧命中，并使用原始动作和声音。万箭齐发、箭猪、敏捷剑客尚未开放训练，不允许花点购买无效果技能。
- 殿堂改用原版 `hero_room_view`、`hero_skill_view`、英雄肖像、徽章/经验条、技能图标与按钮。技能说明数值、等级、剩余点数和存档绑定；角色栏暂只开放艾莉丹，完整英雄列表及字体仍未逐像素验收。
- 新存档从零经验开始。旧版本没有真实经验历史，因此迁移时保留已有英雄等级，转换为该等级的经验下限，不能把这部分视为还原的历史战斗经验。后续经验在战斗中更新，失败/退出前已结算的经验也能保留。

新增 `tools/read_progression.lua` 只导出成长数据，`web/hero-data.mjs` 可随完整提取重新生成；`web/progression.mjs` 独立负责阈值、倍率、预算、训练和迁移，战斗层不读取 DOM。

97 项单测通过，包括原始阈值/倍率、伤害归属、整批舍入、移动期间延迟结算、升级属性、技能扣点/重置、迁移、真实箭命中、双重打击命中时刻，以及全新存档贯穿九模式的经验链。浏览器经过真实开始/存档/关卡界面完成九模式和三星解锁；英雄殿堂另测一级锁定、跨级伤害、训练保存/刷新、17 支升级箭、重置、双重打击动作与手机横屏。

训练浏览器检查在经验阈值附近设置了明确边界场景，用于验证扣点和升级链路；这不是无修改的练级录像，也没有原版同镜头逐帧对照。通关脚本依当前入场等级选择正常预算的防空布防，未改变敌人血量或增加金币。

## 仍未达到 1:1 的部分

- 界面字体、视口适配、转场/闪光尚未逐帧匹配；英雄殿堂、百科、删除确认、教程与挑战结算还有简化。
- 世界地图的装饰动画、道路解锁轨迹和完整镜头行为仍需对照。
- 近战的锁敌/拦截/闪避细节、敌人的完整行为状态、普通飞弹的跟踪和预测弹道尚未完全还原。
- 全局天赋尚未实现；雷电无人目标时的节点边界处理也还有简化。
- 只有部分实机片段与源数据核对，没有同输入、同镜头、全流程逐帧差异报告，不能宣称整体 1:1 完成。

下一批继续恢复剩余英雄技能和敌人投射物，并保留可复查的画面与时序证据。整体任务保持进行中。

## 0.2.7 箭猪的目标连续性

核对 `game_scripts.lua:2803–2812 / 2910–3005`：相同目标每次选定射击增加一层，最多三层；换目标从零开始。训练三级每层增加 1 / 2 / 3 点物理伤害，最高额外 3 / 6 / 9 点，并非三级分别叠加 3 / 6 / 9 层。普通射箭仍在原第七帧出箭，额外伤害随该支箭保存，在飞行抵达后应用护甲及普通箭经验系数。连续性按起手选定目标记录，不按命中数量，移动取消出箭不会回滚已记录的目标。

开放箭猪训练，每级花费一点，复用统一预算、存档与重置。100 项单测通过，新增目标切换、四个训练等级、三层上限、飞箭伤害归属与训练预算检查。浏览器验证训练真实扣点及显示。其被动复用普通箭动作，没有虚构新特效。万箭齐发和敏捷剑客仍未开放；本批不是全流程原版逐帧验收。

## 0.2.8 连射与闪避反击

核对 `game_scripts.lua:2795–3017`、`script_utils.lua:138–157 / 2012–2066 / 2937–3131` 与原模板：

- 万箭齐发训练三级为 3 / 6 / 9 支箭；四帧起手、六帧连射循环、六帧收弓，循环开始 0.1 秒出箭。逐目标预测物理伤害与需要的箭数，分配完成或目标死亡后重选，优先飞行单位。每箭使用普通箭的半秒飞行、伤害与经验归属，同时提供训练等级×25 的技能经验。结束后进入九秒独立冷却；移动打断已出箭连射时仍进入冷却，不删除在途箭。
- 敏捷剑客三级近战闪避概率 10% / 30% / 60%，在来袭攻击自身的 `dodge_time` 检查，成功取消该次伤害并打断未完成起手，反击使用原十六帧动作，第八帧造成 20–40 物理伤害、原音效。没有扩展为远程闪避。原反击模板无 `xp_from_skill`，不因技能表含 `xp_gain` 元数据擅自发经验。
- 两技能训练成本分别为 2/2/2 和 1/2/3 点，五项技能现均可训练、保存与重置。角色等级和技能等级依旧独立。

108 项单测覆盖连射各等级数量、时序、重选、移动打断、箭猪联动、闪避概率边界及真实敌人命中抑制。受控浏览器检查实际训练扣点和四个 Canvas 动作，输出对应截图；九模式浏览器通关回归通过。固定目标与随机边界用于复现技能，并非原版逐帧匹配证据。完整敌人状态、极端目标失效/追踪边界、地图道路装饰与字体仍有差异。

## 0.2.9 纵火者投掷与燃烧

核对 `enemy_gnoll_burner`、`torch_gnoll_burner`、`mod_gnoll_burner` 模板，及原始 `scripts.lua:1947–1987 / 1989–2130 / 4598–4705` 的抛物线、命中距离和持续伤害行为：

- 移除即时固定八点远程伤害。射程 40–125 使用椭圆检查，原三秒冷却独立于近战，7/30 秒后才从高度 36 释放火把；死亡或进入拦截会取消未发出的投掷。英雄与士兵都可成为合法目标。
- 原火把四帧循环，0.4 秒固定抛物线，重力 -900、旋转速度 5π；落点不追踪目标。抵达时对原目标命中偏移进行距离检查，严格小于 22 才命中；目标移动、死亡可使其落空。使用原命中/落空爆炸动作，不造成范围伤害。
- 命中造成随机 2–6 物理伤害并应用两秒燃烧；每 0.4 秒四点无视护甲伤害，结束边界不额外补一跳。重复命中刷新同一个燃烧而非独立叠加。燃烧图层跟随单位原 mod_offset，暂停冻结飞行与伤害。

116 项单测及九模式浏览器通关通过。新增固定目标测试检查出手、抛物线、移动躲避、护甲、四次燃烧、刷新与暂停；浏览器通过真实 World 推进检查火把、爆炸和附着火焰实际 Canvas 帧。受控场景固定目标与动作以便复现，仍非原版同镜头逐帧对比。测试仅调整正常预算下的布防、英雄站位和施法时机，没有改敌人血量或增加金币。

普通弓箭追踪、敌人完整状态与极端投射物边界、地图道路装饰及字体/转场仍需进一步核对；整体保持未完成。

## 0.2.10 大地图坐标、道路与装饰

依据 `kr3-phone/data/kui_templates/screen_map.lua` 与 `screen_map.lua:3038–3066 / 3249–3394`：

- 地图背景使用原始 640×510 设计空间。修正旧版背景居中压缩、旗帜却按 694 宽度定位的问题；背景、旗帜、道路、装饰统一换算。
- 原前三关道路点位、隐藏点和 `unlock_at` 原样导出。已解锁道路静态保留最后一帧，新解锁道路按每点 0.3 秒间隔播放 `mapDot_0000–0009`，不显示后续未开放关卡道路；重复返回不重播已解锁路段。
- 恢复三处八帧循环瀑布，以及原位置、等待范围、淡入淡出时长的光效。鹰与阴影按原始路径、速度 30 移动；鹰沿路径转向，阴影保留方向。原型未加入船只、船尾水纹和完整地图镜头/旗帜转场，不能据此宣称整个大地图完成。
- Canvas 底层与顶层分别位于旗帜两侧，装饰不接收指针；未开放关卡按钮不再截获拖图。地图时间线独立于 World，打开对话框/离开地图停止推进，不消耗战斗随机数。

`web/map.mjs` 单独处理装饰、路径与道路展开；布局由提取工具生成。新增道路解锁、原始坐标、帧段、路径弧长与光效等待测试，浏览器检查实际 Canvas、地图拖动/滚轮、清理及界面适配。完整九模式浏览器流程在第三关前通过真实英雄殿堂消费已获得的四点训练二级万箭齐发，不修改经验、金币或敌人属性。战斗层原有无训练领域回归保留。

仍缺同输入、同镜头的原版逐帧对比，字体和转场、船只等装饰、战斗状态边界继续列为差异。

## 0.2.11 港口船只与旗帜状态

依据原 `MapDecoKR3Ship` 布局、`screen_map.lua:3158–3243` 与 `LevelFlagView:2764–2849`：

- 两条船分别保留原始港内/港外坐标、5/6 秒航行时间及独立等待范围。进港 `out-quad`，离港 `in-quad`；停泊前后各等待一次，中间一秒转向交叉淡化。
- 原船身 0001/0002 与两层水纹独立控制：进港水纹 1–12、离港 13–24、朝内停泊 25–52、朝外停泊 53–80。航程前 20% 显现、末 20% 交叉水纹或消失，水纹使用船身原中心锚点而不是自行居中。
- 修正旧版把所有已完成关卡都画成钢铁旗帜的问题。未获星用原 0002，战役完成用 0004，钢铁完成用 0006；未开放位置继续不可点击。完整旗帜分层、英雄挑战翼章、星星/新旗落地动画和地图镜头仍未恢复。

127 项单测通过，含五项船只状态/边界检查。浏览器检查五个真实 Canvas 阶段、船身与水纹、三种旗帜状态、地图拖动与资源完整性。截图通过控制展示时钟取样，不是原版同步录像或逐像素对照；整体仍未达到 1:1。

## 0.2.12 旗帜分层与资源缺口

进一步核对发现原地图布局指定 `LevelFlag3View`（2638–2755），其中战役动画需要 `mapFlag_0051–0095`、钢铁需要 0097–0116；这个 APK 的实际 `screen_map` 图集只有 0001–0030（含别名），无法直接绘制这些新版帧。前一批把通用 `LevelFlagView` 的参数当成当前类，证据不充分。本批明确采用包内可用的通用旗帜作为兼容实现，不称为已完成新版旗帜 1:1。

- 独立 `web/map-flags.mjs` 输出底座、旗面、英雄翼章和原星星图层，替换 CSS 星星；恢复原版可用的翼章 1–15 与星星 2–18 帧，保存各存档位上次已展示状态，只播放新获得的徽章/星星。
- 新关卡等道路全部展开（点数×0.3 秒）后播放一秒落旗；期间按钮禁用，结束才允许进入。兼容落旗严格采用 `screen_map.lua:2873–2932` 的 alpha、缩放、位移与分段帧数：底座从 0.61 起，旗面从 (1.01,1.414) 起，不用 CSS 自行猜测弹跳。
- 浏览器检查实际底座/旗面/翼章/星星绘制、道路前/后与落旗期间输入门控、结束后能进入关卡，以及地图拖动、手机 UI 和船只。

132 项单测通过。当前兼容绘制仍未补全 `LevelFlag3View` 的缺失素材和完整串行转场/镜头，需原版同镜头证据继续校准；不能因采用原参数与原图就宣称新版旗帜完全一致。

## 0.2.13 原中文字体、关卡文案与 HUD

核对 APK `all-phone/data/font_subst.lua` 的 `zh-Hans` 与 global 映射、原关卡字符串和 `game_gui.lua` 的 HUD 标签，并查看用户 BV1y8411R7iB 第一关分 P 预览画面。预览仅用于确认可见差异，未作逐像素匹配基准。

- 接入包内 NotoSansCJKkr-Regular/Bold 原字体，替换系统中文回退。简体中文的 body/body_bold、h_map、hud 按原角色映射选择字重和字号倍率；不能因为字体文件名含 kr 就换成其他 CJK 字形。
- 数字角色接入原 SohoGothicProMedium。HUD 标签实际属于 hud 角色，仍使用中文 Noto Regular、字号 11×1.2，不笼统地把 HUD 全改成 Soho。心数、金币、波次位置及容器尺寸恢复原 112×38 设计比例，波次使用原 `%i/%i 波` 字符串。
- 前三关模式页改为原中文历史/挑战文案，保留换行；标题与正文读取原角色字号倍率。去掉战役文案下额外拼接的非原版金币/波数说明。原按钮图片自带的字不重复覆盖。
- 新 `tools/extract_fonts.py` 从同 APK 可重复提取三个字体、角色映射、HUD 标签与有限界面文本；完整资源提取自动调用，构建清单包括字体。没有在线字体依赖。

132 项领域回归保留；浏览器验证三字体实际加载、原文、标题字号、HUD 字体与波次、三个关卡文本及手机边界，原 UI 检查通过。中文基线微调、描边/shader、换行算法与完整 HUD/教程界面仍未逐像素对齐，不称为全 UI 1:1。

## 0.2.14 战斗入口操作

核对原 `game_gui.lua:4112–4162` 的 WaveFlag 以及布局 pause_button：暂停使用 hud_buttons_0001/0002（原逻辑尺寸28、右侧锚点36/-8），不再显示原型声音/倍速/返回按钮。入口旗帜接入真实 startWave，替代右下大按钮，多个入口都可召唤同一波；不可召唤时隐藏，模态框期间禁用。稳定 #next 和 Space 操作保留，奖励仍由 World 结算。

本批只是操作入口修正：旗帜位置仍沿用当前路径第一个可见点，尚未恢复原 find_flag_position 的入口安全区避让、箭头、飞行波图标、倒计时扇形与敌情选择提示；不能声明波次控件完整1:1。技能栏位置、教程横幅仍需恢复。132项领域测试、九模式浏览器与入口召唤/提前波/暂停/手机检查通过；截图为当前实现，不是原版逐帧对照。

## 0.2.15 波次旗帜状态

依据 `game_gui.lua:4112–4228` 恢复第一次点击选中、第二次召唤，选中 halo、普通/飞行波图标、方向指针，原 1.25 Hz / ±7.5% 脉冲，以及按可召唤窗口剩余时间裁切的原倒计时图。Canvas 状态读取 World 时间，暂停时不推进；键盘 Space 直接召唤保留。敌情按该入口实际 spawns 的 max 合并计数（零数量不展示），目前以临时文本浮层显示，尚未恢复原 tooltip 图片/定位/敌图布局。进入建塔或技能选择时入口禁用并变淡。

134 项领域测试与九模式浏览器回归通过；入口专项实际验证第一次不出怪、查看敌情、第二次出怪、提前召唤、暂停和手机边界，生成选中及倒计时受控画面。仍没有原版同输入逐帧比较。原 find_flag_position 的完整边界射线/入口长度、安全区定位、旗帜退出 tween、敌情浮层和飞行检测完整模板标志仍需校准，不能声称 WaveFlag 已完整 1:1。

## 0.2.16 原敌情浮层与取消状态

直接核对 `IncomingTooltip`（game_gui.lua:3970–4104）修正前批推测：当前 phone 类使用 RGB(21,17,13)、alpha220 的矩形和10×12几何 polygon，并不是 waveFlag_tooltip_bg 图集或敌图列表。恢复 h11/body11/sans9 原角色、原标题“ 一波敌人即将到来 ”及再次点击提示、三段颜色、随旗帜左右/上下选择的偏移、0.25秒 out-quad 显隐。宽度按原字体三段最大文本测量加20，行高仍使用浏览器近似（不是原字体排版引擎）。读取新的两项原文加入可重现字体提取。

统一取消状态：选塔、选技能、点击空地、暂停与发送波次清除 halo 和 tooltip。选择旗帜后移除过时的准备提示横幅，避免覆盖敌情。135项单测及九模式浏览器回归通过，专项验证原文、首次选择不出怪、第二次召唤、选塔后浮层隐藏/全部旗帜取消。截图等待浮层显现完成。

本批未实现原入口生成与 find_flag_position；前批位置仍旧路径首个可见点。边界取样、箭头位置/像素吸附、字体测高/换行与完整飞行标记还需原版同场景对照。整体仍未达到1:1。

## 0.2.17 原入口与可见边界定位

找到了入口来源：`all/scripts.lua:5752–5767` 将 `editor_wave_flag` 的 pos/editor.r/editor.len/editor.path_id 注册到 locations.entrances，按path_id排序。当前关卡提取已经保存这些作者数据，无需新取图或猜道路切线。Campaign 改用作者角度绘制指针。

移植 `game_gui.find_flag_position:1722–1791`：按当前 Renderer 可见世界边界求朝外射线与边界直线的最近正向交点；四边当前零设备安全区加原65单位间距。顶部/底部入口除侵入间距外保留原pos；侧边按作者len决定延伸长度或从边界回退间距。移除旧路径首个可见点定位。独立函数不改变敌人路径/出怪/奖励。

138项单测、九模式浏览器完整回归、九模式所有波入口可见性专项通过；专项使用解锁存档fixture逐波展示，不冒充正常通关。第三关顶部入口与手机截图已生成。当前未处理非零设备safe-area的坐标换算，仍待原版同镜头校准；本批仅恢复定位算法，不代表技能栏、教程、退出动画或整体达到1:1。

## 0.2.18 原英雄肖像与技能栏

核对 game_gui_hero_portrait / game_gui_power_button 布局，以及 game_gui 初始化对 powers_view 位置的覆盖：技能栏运行时在左下，并非布局表静态pos592；英雄肖像在HUD下方原(7,54)，原42×46逻辑尺寸。技能按钮按原(-8,46,100)水平位置、72×72逻辑图面绘制，保留原透明边界，移除键帽/级别/冷却文字的原型覆盖。

新 BattlePortraits 读取 World：原health/xp bars在(2,39)/(2,42)裁切，原numbers字号8显示角色等级；死亡遮罩按实际dead/dead_lifetime缩减；未解锁英雄隐藏。技能使用原selected、locked左右门与power_loading完整/扇形遮罩，按真实70/15/40秒冷却进度读取，不改变冷却。原phone扇面7π/2到3π/2+phase*2π，原selected与普通图层来自包内图集。锁定/冷却按钮禁用，H/1/2/3保留。

138项领域测试、九模式完整browser、入口操作与新肖像专项通过；专项检查实际开始后H选择、半血/死亡、半冷却Canvas状态差异及手机边界，截图为受控状态不是原版同步视频。解锁开门/ready光效时间线、经验升级特效、像素吸附和非零安全区尚未完整恢复，不宣称技能栏或整体完全1:1。

## 0.2.19 技能解锁与就绪时间线

核对 `PowerButton.set_mode`（game_gui.lua:2894–3012）和原模板：phone解锁使用两片 portraits_power_doors1–10（30fps、右门镜像），同起点播放 power_portrait_glow1–12 后隐藏；冷却结束重播光效并通知一次原 GUISpellRefresh。原 sounds/sounds.lua 将此音效映射到 Sound_SpellRefresh.ogg，已提取并纳入构建。

修正前轮接续说明：模板及脚本未赋值 use_tween，所以当前应走原12帧单次图集分支，而不是猜测循环呼吸。0.3/0.5秒alpha tween属于未启用分支，本批没有强制添加。原解锁分支立即enable，本批保留World的合法操作时刻，没有为了开门动画修改冷却或强加额外等待。

PowerTimeline 按每个World独立记录锁定、解锁、冷却和就绪转换，不读取上局状态；暂停时随World时间静止。140项单测、九模式完整浏览器、肖像/手机检查通过；四时刻实际Canvas门与光效取样及ready通知仅一次检查通过。取样人为设置波次/时间，属于受控动作证据，不是原版同步对照或正常通关。原教程、经验升级提示、转场/退出等差异仍存在，整体未达1:1。

## 0.2.20 首关三页原教程

核对原 level01.lua:28–96：仅首关战役开始发出 TUTORIAL_1，原NotificationView的continue经next进入后续页，skip/gotit关闭；show_notification通过is_seen/mark_seen避免重复。恢复三张原tutorial_slide及标题、跳过/继续按钮图，使用三个原372/464×320布局、原字体角色与原中文字符串（包括模板自带“下一波！”译文，不自行改写）。

新 tutorialMarkup 按原节点坐标/锚点绘制图片和文本。首次弹出暂停World，完成、跳过或关闭恢复；已展示页面标记保存在当前槽位seenNotifications，重载/重进不重复弹；挑战不触发。首关临时顶部准备提示由教程替换，其他关卡不再弹原型准备横幅。原资源提取新增gui_notifications_bg/common及三页布局，fonts提取自动收集原页面文本。

140领域测试、九模式真实browser及原UI/手机检查通过，浏览器实际点击三页按钮（未预置已读绕过）；新专项检查三页、暂停、完成/跳过、重载存档与挑战不弹。页面换行/默认文本对齐、原进入退出动画和遮罩仍需同镜头校准。援军/雷电/英雄波次通知、新敌人提示和教学气泡尚未接入，本批不宣称完整通知系统或整体达到1:1。

## 0.2.21 原援军、雷电与英雄通知

只读提取原 kr3-phone/data/game_gui_data.notifications 及 ctx 模板，新增read_notifications.lua（设计时vector/i18n/伤害枚举stub，不执行游戏控制脚本）。按level01.lua在波2/3/5展示POWER_REINFORCEMENT/POWER_THUNDERBOLT/TIP_HEROES，读取原图、标题、中文描述和确认按钮。原power面板是direction=h的三片背景，不是九宫格；采用lt/ct及镜像右片，修复Grid默认最小尺寸使切片越界的问题，并检查内部图片边界。

通知串行展示并暂停World，确认后恢复或展示下一条；展示时保存seenNotifications。三个原描述都有always=true，按原show_notification规则，重玩仍展示，不错误地用已读压掉。挑战模式不触发；移除已由通知替代的临时波次/能力横幅。GGLayout顶向文字流使用浏览器行高近似，仍需原字体测高校准。

140项单测、九模式浏览器通过；通关脚本每步消费实际事件，通过正常按钮click关闭三条通知并断言顺序，未预置已读或禁用通知。专项验证真实startWave触发、暂停/恢复、已读/always重玩、串行排队、挑战排除和手机边界，截图是受控波次fixture。

原TUTORIAL_1/2/3描述也有always=true，本批修正前批开场教程“已读不重复”的错误策略：重玩仍显示，已读记录保留而非用作压制always通知。原教学气泡、新敌人icon队列及面板过渡/音效仍未完整恢复；整体继续进行。

## 0.2.22 原教学气泡

导出原tutorial_balloons元数据和balloon_map_slices九片/两类callout；核对GGBalloonView、TutorialBalloon源码（gg_views_custom.lua:282–455、game_gui.lua:4409–4580）。PHV函数在phone分支直接返回值，不除二；body16、带标题body12/small_title14、原文字颜色与中文原文已接入。i18n.cjk在中文选择第二个参数，修正只读提取stub。

首关开场TB_START/TB_BUILD，首波可提前召唤时TB_WAVE；能力通知元数据signals展示TB_POWER1/2，选中对应能力后移除并接续TB_ROAD，施放/取消/切换移除。建造菜单暂隐建塔气泡，建塔成功移除；开波移除召唤气泡；挑战不展示，结束清理。来源为world的气泡读取Renderer世界变换，bottom-left使用UI参考空间，不把两类坐标混用。

独立展示时钟不消耗World随机数，原0.3秒in-quad显现、.8起始缩放及.985/1.015的.3秒in-out-sine摆动、0.4秒in-back缩退已接入。字号/自动宽高使用原字体Canvas测量，仍受浏览器测高/换行与原Love实现差异影响；临时建塔菜单隐藏暂为即时显隐，不宣称完整像素/逐帧一致。

142单测、九模式完整浏览器通过。专项实际点击建造/技能，检查开始/建塔/道路气泡、菜单暂隐、建塔成功/开波移除、取消和手机边界；施法解锁阶段使用受控合法开波时刻，截图不是原版同步录像。新敌人图标、通知过渡/音效、镜头/转场、完整敌状态等仍未完成，整体继续进行。

## 0.2.23 原新敌人图标与说明

核对原公共spawner在create_entity前检查is_seen并发送wave-notification/icon，及game_gui:2048–2073、4294–4323。World新增只读enemy_spawn事件，Campaign的EnemyNotifications按存档已读去重入队；已读在入队时保存，点击图标才打开原通知并暂停，确认恢复。图标按原60×48和2间距排列，英雄出现后队列从y60移至104；原.3秒alpha与呼吸、.4秒in-back缩退、原GUINotificationSecondLevel音效接入。reaver的icon_signals接TB_NOTI，点击发noti_shown取消指引。

五种敌人使用原enemy模板、ctx.id、原插画与相框/背景、中文名称/描述/特性，没有根据假定布局添加HP统计。提取补充encyclopedia图集；模板绘制补充父级缩放/旋转对子层级的继承。原spawner的首见判断不限定战役，因此挑战也遵循同一已读规则。

本批专项的后四种首见使用真实spawn接口的受控场景；首次盗匪通过真实开波自然生成，另有独立九模式通关回归。截图为当前实现，不是原版同输入对照。原字体测高、通知面板进入/退出动画与声音仍未完全对齐；整体继续进行，未达1:1。

## 0.2.24 原通知展开与缩退

核对NotificationView(game_gui.lua:4330–4402)及原sounds表：展示先暂停/禁用战斗输入，0.1秒后打开黑色100/255遮罩，alpha0/scale0.5用0.4秒out-back到1；关闭立即恢复World、撤去遮罩，同时alpha1/scale1用0.4秒in-back到0/0.5后移除。此前接续说明中猜测的pos_y移动并不存在，本批没有添加。教程continue原next分支直接换页，走no_transition，保留0.1秒初始化但不重新缩放；确认/跳过走正常缩退。

新增NotificationMotion负责原曲线采样、入场取消及非交互退出副本，避免旧面板动画遮挡新面板或延迟战斗恢复。原GUINotificationOpen/Close映射Sound_NotificationOpen/Close.ogg已提取并可重建。通知选中时清除旧塔/能力/波次输入。原HUD隐藏/返回独立协程尚未恢复，不将本批面板动画等同完整UI转场。字体测高、镜头、挑战结算等仍需同镜头证据，整体未达1:1。

## 0.2.25 原通知 HUD 分组退场与返回

核对phone show_gui_hud/hide_gui_hud(game_gui.lua:1842–1939)：隐藏默认0.4秒out-back，返回0.4秒out-cubic，反向前取消旧timer并从当前位置继续。按原父容器/图片尺寸导出battleHud，状态栏上移57、暂停上移42、英雄父容器左移150、通知队列左移90、技能栏下移anchor.y=60（原安全区当前0）。英雄父宽100不能误用单个肖像42，通知队列宽60不能按全屏host宽计算。

HudMotion只写各组translate，保持英雄/技能Canvas、图标自身scale及建造点独立。通知/教程进入隐藏，页间不重启退场；关闭立即开始返回，与面板缩退并行，连续通知重入从当前位移接续。切场景清理，不把battle-slots或整个battle-ui隐藏。bag/infobar等未实现界面不虚构替代品；非零safearea和其他全局HUD触发场景尚未对齐。截图为当前受控通知状态，非原版同镜头逐帧对照；整体仍未达到1:1。

## 0.2.26 波次旗帜退出与金币反馈

核对WaveFlag.remove(4187–4201)：停止pulse，0.5秒out-quad到alpha0/scale1.5后移除。已召唤旗帜保留冻结Canvas副本退出，副本无id、disabled/inert且pointer-events:none；正常下一波仍使用稳定next按钮。退出与新入口创建分离，切场景清理。飞行波改用原模板vis.flags的128位，去掉按敌人字符串猜测。

核对show_early_wave_reward(1793–1806)、WaveRewardFx(4831–4843)、SpriteDigits(4846–4874)：点击附近的nextwave_coin1–14与waveReward数字，+映射11，每字间距round(width*.7)，以总宽居中、上移金币图高，1.5秒out-quad淡出；coin采用原KUI非loop的ceil取帧后停末帧。原临时顶部金币横幅已移除，World奖励数值未变。Space沿用最近指针位置，无指针时使用画面中心。

148单测、九模式通关及专项验证实际金币增量、两点击只召唤一次、退出副本/奖励清理、手机Space。受控提前波截图不是原版同输入证据。原TimeRewardFx与技能冷却奖励尚未接入；不以仅绘制减少秒数冒充真实冷却生效。完整提前波奖励算法仍需核对原systems后恢复，整体继续in_progress，未达1:1。

## 0.2.27 原提前召唤冷却奖励

核对common systems波次协程：发送非首波时，先round(interval-(tick_ts-last_wave_ts))得到奖励秒数；普通关卡金币ceil(seconds*GS.early_wave_reward_per_second)，原设置为1。新增只读read_wave_rules.lua与wave-rules.mjs，World从此前ceil剩余时间改为原取整顺序。PowerButton.early_wave_bonus(3046–3054)只有cooldown且seconds>1才减start_ts；World仅对已解锁且冷却中的三技能扣减相同秒数，归零截断，事件保留名义秒数用于原数字，避免把实际剩余量当显示奖励。

TimeRewardFx使用waveRewardTimer的负号11/s12，原.7字宽舍入间距、1秒out-quad淡出与数字向上移动图高1/3。其原KView只设置size.x、height保持默认0，因此按钮处根定位y为0，不能按数字图高误设根y=-12；Canvas留白只供数字上移裁切。减时数字附着技能按钮，跟随HUD移动，不改技能原冷却总时长。金币和冷却事件分别消费，首波/自动到时无奖励，已就绪/锁定技能不显示减时。

156单测和九模式完整浏览器通过；专项先真实施放三技能，再正常提前召唤，断言三项真实冷却下降、原数字与清理、手机Space。场景仅提前设置可召唤等待时刻作为受控fixture，截图不是原版同镜头证据。其余镜头/转场、完整敌状态与字体等差异仍在，整体未达1:1。

## 0.2.28 模式徽章与结算串行时序

核对game_gui.lua:433–510、651–660及hump Timer.tween。原badge_1/2/3按游戏模式选择，对应campaign=0002/heroic=0003/iron=0001；此前按星数挑徽章错误，已修正。按原badges父容器位置/锚点/各模式star位置绘制；徽章0.6秒out-back展开，额外1.5为easing overshoot参数，并非等待时间。0.15+0.5秒后播原stars1–19/38/54，GUIWinStars以0.7秒间隔；星动画完成后继续按钮0.5秒展开，再重试按钮0.5秒展开，结束才启用。挑战只播放其原单星，不套三颗战役星。

使用GUIQuestCompleted/Failed、GUIWinStars的原音效并纳入提取与构建；胜败时隐藏HUD。失败按原0.4秒out-back/overshoot0.8从上方进入。胜利去掉原型的额外模式/星数文字，用原继续/重新开始中文按钮。Canvas标题基线修正为字母基线、使用原粗体；原GGEllipseText弧形排版仍未复现，不称标题1:1。

157单测与九模式完整browser通过，专项分别检查3模式徽章、星序列、延迟禁用、返回地图和手机失败重试；专项直接给定结算状态，是受控画面测试，独立九模式仍正常通关。胜利粒子、宝石区域、完整失败面板原文与装饰仍待恢复，本批不宣称完整结算或整体达到1:1。

## 0.2.29 原弧形字算法与失败面板

原GGEllipseText位于all/gg_views.lua:822–874，并非phone自定义文件。逐UTF-8字符测宽，文字总宽居中后，字符中心y=sin(x/ellipse_w*π)*ellipse_h，rotation=-((x-start)/total-.5)*max_angle，anchor=(字宽/2,字高*2/3)。新增ellipse-text纯布局/Canvas绘制，沿原胜利节点180×-20、最大π/6、button40、原颜色绘制。测宽/测高使用原字体的浏览器实现，仍可能与Love get_font_height不同，未取得原版逐像素证据。

失败页改用完整原布局的链条、背景、提示切片、物品插画与原中文，恢复其1.7纵向切片缩放、原重新开始/退出按钮，移除原型自写建议。原宝石统计当前显示实际0；未实现商店，故没有假可用购买入口。layoutMarkup补text_key与独立切片缩放，字体提取纳入失败原文。宝石经济和商店仍不在当前实现中，保留明确差异。

159单测、九模式完整通关、三模式结果/手机失败重试通过；截图是受控结算状态而非原版同步对照。胜利粒子与宝石区域、镜头/场景转场、完整敌状态和字体渲染等仍待对齐，整体未达1:1。

## 0.2.30 胜利星粒子与宝石区域展示

核对VictoryParticles(game_gui.lua:4246–4287)：0.15秒后一次发射150颗，原victoryStars_star_0001贴图，方向-π/2、spread2π/3、speed400–1000、重力(0,2000)、径向加速度-200、寿命0–1.5、大小ref_scale到1.4*ref_scale、白色alpha1到0、add混合。独立全画面Canvas与badges同级，不继承徽章缩放。展示用独立固定随机序列与1/120步积分，不消耗World随机；Love后端随机与积分实现尚无同输入逐帧对照，不能宣称粒子逐像素一致。

原win_Gnome宝石区域在星完成后从x200到326以0.4秒out-elastic弹出，保留原位置/图面与数字旋转，展示当前实际0宝石；没有添加宝石奖励、假商店或广告按钮。数字描边/字体尚为浏览器近似，宝石经济未实现仍记录差异。

161单测、九模式完整通关通过，专项检查发射时段、衰减、图层隔离、场景清理、零宝石与手机边界。取样图为受控胜利状态，不是原版同步证据。整体仍未达到1:1，镜头、场景转场、敌状态、字体等差异仍需继续。

## 0.2.37 四系第一层全局星星升级

核对kr3/upgrades.lua数据与patch_templates、utils.count_stars(1200–1212)、screen_map3436–3503：预算为战役最高星加每项英雄/钢铁完成各一颗；原购买成本四项各1星，重置返还。新增独立upgrades保存字段，读取时校验已实现节点与总预算，与heroSkills/角色等级分离。未购买默认不改共享模板；每局克隆模板只应用选中节点，并读取原关卡max_upgrade_level上限。

已开放：master_shooter弓塔伤害倍率1.05（随机基础伤害后ceil）、elven_fencing兵营价格ceil(.9倍)、crystal_focus法师射程ceil(1.05倍)、hardened_boulders巨石伤害上下限ceil(1.1倍)。只改原模板对应的基础I–III塔；未实现后续塔与其余天赋不可购买，没有无效果扣星。四项源成本/图标/说明由只读read_upgrades导出，原升级树、详情、价格、完成/重置图与中文接入；地图新level2升级气泡现在指向真实功能。

原购买粒子、节点可购买/选中转场、详情自动测高与原升级界面入退动画尚未完整复现；本批不是整棵天赋树完成，也不构成整体1:1验收。手机按实际游戏视口适配；截图是当前受控进度取样。无天赋九模式正常通关、领域预算/退款/模板隔离/挑战上限/实际箭伤害、真实购买保存重置与手机边界专项通过。

## 0.2.38 四系第二层天赋与前置

核对原upgrades.patch_templates的目标表常量：treesinged_bow为弓塔I–III（源还含未实现两种高级塔），range_factor=1.1；expert_tactician为兵营I–III，rally_range_factor=1.1；bane_spell为bolt_elves_1/2/3，damage_factor=1.15；sharp_splinters为rock_1/2/3，damage_area_factor=1.1。均按原ceil修改模板值，四项各1星。高级塔未实现，没有假购买入口。

每项第二层必须同系第一层，UI可查看锁定说明但购买禁用，领域层同样检查；旧存档规范化按第一层/第二层顺序保留连续链，删除孤立第二层。挑战max_upgrade_level只过滤本局效果，不删永久购买；重置全额退款。兵营集结点操作移除原型写死145限制，实际使用补丁后的rally_range=160，与画面范围一致。其余未实现节点仍不可购买。

192单测通过，包括三等级原值、前置/迁移/退款、挑战保留存档和实际超出旧范围的集结点设置；浏览器专项真实购买八项、重载和重置/手机边界。无天赋九模式回归中发现旧第二关英雄策略对准备期一帧差异敏感，在XP3587/3632与0/1/8/15/45准备帧复现；仅调整合法英雄站位和雷电施放判断并补回归，未修改金币/敌血量/冷却。截图为当前受控进度，非原版同步证据。购买粒子与完整界面转场、其余天赋仍待实现，不称整体1:1。

## 0.2.39 原升级购买反馈

纠正接续假设：all-phone/screen_map.lua:1589/1625的IS_PHONE分支直接显隐，没有面板位移。0.5秒out-quad进入与0.3秒in-quad退出属于后续非phone分支，本批没有把它们添加到手机版。购买按钮804–817从模板y141/当前y向shown_y210或hidden_y140移动0.2秒，hump默认线性；重选取消旧插值并从当前位置继续，show立即启用、hide立即禁用。

购买后按原819–838自动选同系下一项，未实现项仍禁止购买；购买标记与选中边框独立叠放。进度条按原level*48/220缩放并保持底锚点、在类别图标后方；可购买/不可购买价格采用原金色/灰色。原upgrade_check_anim1–7单次播放停末帧，reset禁用状态与真实购买一致。GUIBuyUpgrade(原gain=.6)/GUIQuickMenuOpen/GUIButtonCommon音效已映射提取，并保留全局用户声音开关。

BuyFxParticlesView位于all/shop_views.lua:547–579，源一次20颗，方向0/扩散2π、速度100–200、寿命0–.75、径向加速度-200、旋转[-π,π]、大小.2*ref_scale到2*ref_scale、白alpha1到0，无重力，无add混合，1秒删除。独立展示随机数及1/120积分用于原upgrade_fx_particle；不会改变World随机/经验。Love后端随机与积分尚无同输入逐帧对比，不能称完全像素一致。reset在原剩余星标签附近产生反馈，退出/切场景删除旧Canvas与状态。

195单测、九模式完整浏览器三战役三星、首两层购买/重置/存档和原UI专项通过；新专项以受控展示时钟取按钮0/100/200ms、粒子与勾选帧，并验证自动选中、取消重入、手机。实际查看粒子图并修正类别图标与进度条层次。对话框聚焦使用preventScroll，缩放重置隐藏游戏容器的DOM滚动，避免重开/横屏时边界偏移；地图拖动状态不改。截图为当前实现非原版同步证据。文字测高/换行、完整天赋和其他FIDELITY差异仍在，整体未1:1。

## 0.2.40 可选雷电一级升级与援军调查

核对kr3/upgrades.lua中thunder_level_1分支：只把power_thunder_control.thunders[1].count从3改为6，原cooldown70、每击50–90真实伤害、.2–.4秒间隔及已有重新选敌逻辑保持。原声明hits=6、price=2，已开放原节点、扣星/保存/重置与挑战max_upgrade_level门控；角色等级/英雄技能训练不会自动启用。现有SpellTimeline直接读取已补丁的count，因此是六次真实事件而非额外装饰光柱。

198单测、九模式浏览器通关及三战役三星、原升级/动效回归通过。新专项正常点击购买两星、原自动选下一项且保持不可购、重载后进入战斗，使用真实World与Renderer验证六次命中时间线及第六击画面、手机与退款；战斗部分为受控待出怪fixture，不是原版同输入录像。没有改变默认伤害、生命、金币或冷却来迁就回归。

援军一级没有开放：本轮证据确认common/scripts.lua:6314–6333原每次分别随机re_current_1/2/3，在中心(+10,-10)/(-10,+10)两处生成；默认别名是soldier_re_0_1/2/3，40HP、0护甲、1–3伤害；一级天赋才改成soldier_re_1_1/2/3，60HP、.2护甲、3–5伤害。当前原型默认仍用soldier_re_1，误用了一级属性，且通用%s前缀没有三种皮肤的完整映射。这是明确未解决差异，不能说援军已还原或出售无效果一级节点。相关原数据已纳入catalog以便后续恢复。

只读script_utils798–832与common/scripts993–1064还确认10帧淡入后开始动作；死亡/20秒到期会按原朝向向外走50并反向淡化，而非原型即时删除。一次尝试同时恢复这些状态及两次原随机选择会使既有无天赋合法策略失效，已保留诊断记录并将该完整校准拆为下一批，没有把60HP包装为未训练原值，也没有削敌/加金币来掩盖。整体仍未1:1。

## 0.2.41 原援军零级、三皮肤与真实一级天赋

按common/scripts6314–6333恢复两次独立1–3随机选择re_current别名，在施法中心(+10,-10)/(-10,+10)生成；默认为soldier_re_0_1/2/3，40HP、0护甲、1–3近战伤害，原A0/B0/C0外观。没有保留错误的未训练60HP基线。10帧淡入时可见但尚不行动，严格超过20秒或死亡后立即停止拦截/攻击、hp归零，按当前flip向外走50（speed60），以10帧反向alpha淡出后继续完成离场；不是播放死亡姿态或即时删除。Renderer只读取状态，别名攻击动画长度从具体prefix读取，不修改其他敌人的时序。

reinforcement_level_1按原price2开放，替换三个别名为soldier_re_1_1/2/3，60HP、.2护甲、3–5伤害；原15秒冷却、20秒寿命及同皮肤保持。控制器默认99不是GUI实际冷却，实际从re_current_1.cooldown读取15；购买分支也按源写回控制器。共享模板不变，未训练/重置/挑战cap0保持真正零级，英雄等级与heroSkills不启用全局天赋。其余援军/雷电节点仍禁止购买。

205项领域回归通过，包含源属性/独立随机、生成位置、严格到期/死亡离场、购买预算/退款/挑战上限，以及保留的无全局天赋新存档XP链和准备帧回归。旧合法策略曾因原40HP基线和两次随机选择失效，仅调整正常布防、施法与英雄驻守，不修改金币/敌HP/冷却或测试三星阈值。三皮肤Canvas淡入/待机/淡出、实际两星购买后的60HP单位与手机专项通过。截图使用受控位置/时间和额外三个外观样本，不是原版同输入录像。完整nav_rally/敌人槽位与全部状态边界仍未逐项匹配，整体未达到1:1。

本轮完整浏览器新存档链没有全通过：第一关三模式通过，第二关战役入场XP2129、准备约1秒时正常获胜但17生命（两星），三星断言失败。纯Node相同进度的准备期与后续XP链回归通过，不可据此冒充浏览器九模式成功；该合法策略的准备时机稳健性仍需下一批校准。保留失败断言和日志，没有降低三星标准或修改源战斗参数。


## 0.2.41 浏览器回归复核：真实开局预算

后续复核纠正了上一段对差异的归因：完整浏览器在第二关开始前真实购买70金币弓塔、升级110金币再出售，原60%返还108，实际开局预算为278而非350，净损72金币。此前只复现XP/准备帧的Node场景漏掉了这段正常界面操作，并非同初始状态。保留购买/升级/出售验证和原金币/冷却/HP/三星阈值。

测试策略现在记住正常购买前的开局金币；第二关预算已减少时让英雄留守原出口防线，避免追逐前方敌人时留下缺口。没有新增精确XP分支。新领域回归通过真实build/upgrade/sell产生278预算，覆盖XP2064/2129/2187与准备0/1/8/15/45/60帧共18场，均胜利三星。206项领域测试全部通过，完整浏览器九模式及三战役三星、存档、手机触控也通过；真实第三关入场XP3932，照常通过英雄殿堂花已赚点数训练二级万箭齐发。

公开Pages已确认0.2.41，远程完整九模式、三战役三星、存档与手机链路，以及援军Canvas/原界面购买专项通过。修正完成截图等待条件，返回地图的Canvas门转场完全结束且地图就绪后才取样。本批只修改测试策略、回归和证据文档，游戏静态包仍为已发布0.2.41。测试通过证明这些合法操作可完成，不能替代原版同输入逐帧验收；整体1:1仍未完成。


## 0.2.42 原菜单存档面板时序

菜单的直接来源是all-phone/screen_slots，不是启动厂商标志的screen_splash过场。核对211–245/357–365/686–815：菜单logo从.6缩放至1，.5秒out-back；.6秒后按钮.4秒out-back展开，制作名单再晚.4秒。点击开始后设置等现有外围按钮.4秒out-back收起，制作名单先.2秒in-back，开始按钮再晚.2秒用.2秒in-back收起。无云存档服务分支在.1秒后显示slots_panel，从原y480到150，.4秒out-back；返回时面板.4秒in-back到480，之后开始按钮.4秒out-back，再晚.4秒展开制作名单。坐标/锚点直接读取现有原模板，未将战场loading门套到这个同背景的面板切换。

新增MenuMotion独立维护WAAPI展示、旧控件/面板副本与取消版本，不推进World。logo在两种视图中保持，退出按钮在面板后方，退场副本去id并inert；切场景取消旧动作，返回中不重复派发，快速Escape从当前面板位置反向，不从终点跳回。源GUIButtonCommon沿用已提取音效。删除后刷新存档内容不重播整个面板入场。旧CSS chain-drop/panel-arrive不再驱动这两界面；减少动态效果偏好显示静态终点。

208项领域测试、完整九模式/三战役三星、UI手机边界通过；新test:menu-motion以真实DOM/WAAPI时钟取0/100/300/500ms面板位置和回弹，验证共享logo、双击、Escape反向、删除/重开、三个存档选择及手机。截图为当前受控取样，非原版同输入逐帧。完整SlotView/SlotTab状态、云服务、存档到地图的director交接和其他标题装饰仍未完全复现，整体未1:1。


## 0.2.43 存档与地图的原 director 交接

只读director_data.item_props确认map/slots都show_loading=true；screen_slots.handle_slot_button680–684在加载/创建存档并选为active后回调{next_item_name='map'}，screen_map2287–2291回调{next_item_name='slots'}。后者进入screen_slots根菜单并执行start_animation，对应当前title而非直接弹存档面板。tools/read_director_routes.lua只执行声明数据并用jit.util检查这两个函数的常量，不执行游戏init/update/callback，可重现该证据。

原director240–318立即禁用旧window并忽略重复done，384–510选screen_loading，605–704等待queued ready/init/首画后open。新增真实selectSave/returnToMenu路由复用已有loading门时序；存档选择先设置真实active slot，关门交接前保留旧画面。关闭后准备目标背景、原图片、地图图集并等待首帧，再开门和恢复输入。SceneTransition在等待门图时就把screen/battle-ui/veil设inert，完成/取消按原状态恢复，旧事务不覆盖新事务。返回菜单的MenuMotion在准备/开门时暂停，成为活动界面后继续，避免慢图片解码消耗整个入场。旧慢加载回调只完成自己的等待，不重新选存档或切场景。失败恢复可操作菜单/地图并提示，没有修改战斗。

208项Node、完整九模式三战役三星、菜单/旧加载门/首入地图/UI手机回归通过。新test:director实际点击存档和返回按钮，受控延迟资源就绪，验证旧画面、即时输入门控、重复拒绝、关闭等待、返回菜单暂停、取消后第二存档隔离及手机失败恢复。截图是当前受控慢加载状态，不是原版同步对照。原queued init额外预更新tick、全部资源管理与平台服务尚未逐像素复现，不能称整个director或游戏完全1:1。

### 0.2.44 原三存档条目与行内删除

按 phone screen_slots SlotView1224–1303、SlotTabView1310–1340与原slot_view/slot_tab_view模板绘制空槽/已有/删除三状态。存在性读实际槽记录，不再拿星数判断：零星已有进度仍显示已有槽。原图标、坐标、中文“新游戏/删除栏位？”与确认/取消图，删除页签仅已有槽出现，x213到263与返回均.2秒linear；重入取消旧动画，快速取消不会被旧hide回调再次藏掉。确认/取消按钮按原down_scale=.95。删除只影响该槽，并清该槽mapSeen/mapHistory，取消不写存档，无虚构云同步。

storage.get_slot_progress原316–358计战役星与每个已完成英雄/钢铁各1，SlotView另列两种完成数。原game_settings.max_stars=110，所以采用原分母110（可玩内容仍只有前三关15星，未借显示开放后续关卡）。源标签字体/纵向对齐来自模板，浏览器基线与Love测高仍未像素校准。删除只刷新目标行，其他槽状态和动画不重播；完整平台云状态仍未实现。

209项领域测试、九模式真实浏览器与三个战役三星，以及空/已有零星、行内确认/取消、刷新、真实选槽/删除历史清理、手机与菜单/map-start专项通过。截图为当前受控进度，不是原版同步对照；整体仍未达到1:1。

### 0.2.45 英雄殿堂原文与技能预览

原screen_map102–158/3955–4115/4253–4315：按真实经验计算等级/点数与属性，技能详情使用clamp(rank+1,1,3)原DESCRIPTION，标题rank0无后缀/rank1为II/rank>=2为III。新hero-room.mjs从模板key VOLLEY/PORCUPINE/NIMBLE/DOUBLE/HAIL绑定原中文，移除手写算法说明、额外经验/训练消耗覆盖。剩余点只在原333/80.5标签显示数字，各技能图标原27/27价格与三个点标记，满级隐藏价格；打开/重置默认第一项multishot，训练后保持原技能选中，重置零等级时禁用。

健康/伤害/护甲/攻击频率分别按原标签、字体角色与颜色绘制，护甲采用gui_utils14–24的CArmor分档，不再用百分比替代原描述。经验条按原scale.x从左向右缩放（非旧裁切）。训练在原技能中心发射已核实BuyFxParticlesView的20粒子，复用独立UI RNG/积分，不推进World；关闭、重绘、切场景销毁旧粒子。技能选择原GUIQuickMenuOpen音效，按钮仍使用稳定ID与真实trainHeroSkill/resetHeroSkills预算，不改变角色战斗、全局天赋或经验规则。

211领域测试、九模式浏览器三战役三星、UI与hero-skills检查通过；新hero-room专项覆盖五技能所有等级原文/下一等级标题与价格、点数、真实训练/重置/关闭重入、粒子清理和手机。高等级专项以受控经验fixture检验UI，不是正常无修改通关，九模式独立完整链保留。截图是当前实现取样，未取得原版同输入逐帧。Love字体基线/换行、英雄列表完整角色与选择边框/闪光、首次英雄殿堂help气泡仍有差异，未宣称整个英雄殿堂或游戏1:1。

### 0.2.46 英雄殿堂首次引导与当前英雄反馈

核对原phone screen_map1809–1835/1207–1216：打开英雄殿堂且hero_room_help未读时显示遮罩及两条原提示；点击遮罩才set_seen并隐藏三项，关闭面板不标记已读。将该已读保存于独立seenMapHints，保持各槽隔离，与战斗always通知无关。原hero_help专用11片与MAP_HEROROOM_HELP1/2原文已导出，createBalloon支持显式prefix（其他地图/战斗调用默认不变），按原max_size/flags/pos显示，不添加未声明的滑入/呼吸。遮罩期间下层按钮inert，Enter可正常点击继续，Escape关闭且未读状态保留。

原HeroThumbView3908–3952/3955–4115/4186–4189：补当前艾莉丹缩略图原边框/check与已选择图面；实际点击缩略图执行show(true)刷新第一项技能，缩略图与大肖像白闪.2秒in-quad(1-t²)。这与select4117–4153的.8秒反馈是不同路径；当前仅一个已选英雄，不假造新角色选择/解锁。独立HeroFeedback由UI时钟驱动，重入/关闭/切场景清理，不改World。补齐原1202–1206训练GUIBuyUpgrade音效（源gain .6），仍使用原真实点数函数。

212领域测试、九模式浏览器三战役三星、hero-room/UI/guidance专项通过；新增hero-help专项验证首次显示、实际点击与键盘、关闭不已读、刷新/重入/存档隔离、0/100/200ms双处白闪和手机。共用测试helper真实点击继续，不预置seen。图片是当前受控取样，非原版同步像素证据；气泡测高/换行及Love字体/随机后端仍有差异，完整角色列表/跨角色选择未实现，整体继续未达1:1。

### 0.2.47 原百科敌人分支

新增encyclopedia.mjs，替换五篇CSS统计文章。按原screen_map1854–1912、3707–3805与phone模板接入原索引、敌人书页、16格缩略图、插画/相框、姓名/描述/特殊能力与六项统计、分页和返回。read_encyclopedia.lua只读kr3/game_settings声明，导出原47条/3页顺序；盗匪always_shown，其余四种由真实spawn通知产生的seenNotifications解锁，未见原锁图且禁用，不因浏览百科而mark_seen。超出当前五种支持范围的条目保持锁定；防御塔/提示/外部攻略分支目前disabled，未伪装为可用功能，尚不是完整百科。

原独立encyclopedia_thumbs图集之前未提取，现加入可复现完整提取，catalog11534frames/146sheets，UI412sprites/18layouts。确认本次重提没有改变任何模板或动画数据。normal/base模板统计不读取当前战斗难度：生命/物理魔法护甲、速度按gui_utils分类、近战伤害ceil（零或无伤害显示None原译文）、lives_desc原文。法术/攻击行为不改。布局镜像按原锚点画两半书页，按钮按原hit_rect，fit_lines采用浏览器文本测高近似并保留相对单位，旋转/resize不锁死像素字号。纸张翻页原GUINotificationPaperOver音效已提取，源码/构建可复现。

214Node、九模式完整browser三战役三星、UI及新encyclopedia专项通过。专项按真实按钮进入，正常点三页开场教程后通过World.spawn受控首见四种敌人，检查5详情、已见/未见/3页、返回、重载/存档隔离、手机；这不是无修改通关证据，九模式天然XP链独立保留。截图已查看，为当前受控样本，非原版同步。全文字体基线/换行、部分按钮按下反馈/索引非敌人分支与完整敌人册仍有差异，整体仍不1:1。

### 0.2.48 百科原23条提示

原game_settings.gameplay_tips_count=23，非模板占位1/30。read_encyclopedia导出真实数量，extract_ui纳入encyclopedia_tips_view和横向三片纸张背景，fonts按配置收集TIP_1..23原中文。启用真实提示入口，打开必回第1条，原箭头/关闭/标题/正文/页码坐标、字体角色、.9行距、文本框与fit_lines保留；.9按原字体实际测高换算浏览器行距，避免直接CSS乘字号造成行间重叠。继续使用相对单位以支持旋转/resize，测高与Love后端仍存在近似，未进行像素完全验收。

原screen_map910–921/1863–1880：首条禁prev、末条禁next，正常按钮路径不环绕；返回索引再打开重置1。当前API对越界参数作clamp，未复刻原回调内部zmod的非法参数路径；真实边界按钮均禁用。沿用原纸张翻页与通用按钮音效，不写进度、不改enemy发现状态。塔和外部攻略分支仍未开放。

214领域回归、完整九模式browser三战役三星、本地及公开Pages UI、原enemy百科与新tips专项通过。tips专项实际点击全23页逐项核对原文/页码/完整显示、边界、回退/重开、敌人分支/返回地图、readonly进度、Escape与手机；截图第1/8/20/23页和手机均为当前实现，长页已人工检查修正行距，不是原版同输入对照。整体仍未1:1。

### 0.2.49 原百科四系基础塔与发现链

按phone screen_map1882–1896/3611–3699接入原20格塔书页，四系I–III的12个原缩略图/插画/中文/选中框、普通/魔法/兵营三种属性面板与返回。一级always_shown，其他条目只按seenNotifications中的原entity键解锁；后续八塔当前未实现，仍原锁图且disabled，不开放战斗购买。书页不加原本没有的价格/升级按钮，不写存档。基础统计直接读取Repository原catalog，非World的全局天赋patch模板。

common scripts1393–1420/1541–1550/1711–1750：普通塔bullet上下限乘tower.damage_factor再ceil，法师再乘loops（一级双弹8–12），兵营读取soldier的HP/近战上下限ceil/armor/dead_lifetime。gui_utils26–34/44–53按原阈值显示射速/范围（range先乘2），兵营重生用原%i sec.中文。原模板没有费用项，未猜加费用。441sprites/18layouts，新增三属性背景、12缩略图和动态插图，字体包含原塔中文/分档/秒数。

核对真实level02/03 campaign waves.groups[0].waves[0].notification分别TOWER_LEVEL2/3，systems波次分支发view；原game_gui2075–2110展示时mark_seen附属seen四塔。接通这两条原always通知及原tower_4模板，展示才保存对应二/三级发现。不是按通关/已建塔/当前等级推断解锁。挑战不触发该战役数据路径；未迁移猜测旧存档历史，旧玩家须实际重新看原通知后解锁。

215领域测试、九模式完整browser三战役三星、塔/敌人/23Tips百科/UI及公开Pages UI通过。塔专项由实际startWave触发二/三级原通知（受控阶段解锁fixture），真实确认后检查12详情、未见锁、重载持久化、只读浏览/分支返回与手机；非正常九模式通关证据，独立完整回归仍通过。桌面兵营和手机页已查看，为当前受控取样，非原版同步。原文字基线/测高、图层按下反馈与完整后续塔/角色仍不完全一致，整体未1:1。

### 0.2.50 原基础塔圆环菜单与确认

read_tower_menu只读原kr3/data/tower_menus_data及jit函数常量，不执行控制器；extract_ui导出menus/原9处坐标/root.max_scale=.88/tooltip模板与原disabled/check/price素材（556sprites/19layouts）。TowerMenu用原gui_ring122logical、各图面原宽高、place中心减半尺寸定位，不再CSS百分比猜圆周。建造四角、I/II升级place5、出售place9、集结place8；III未来分支保持原位置锁图，未开放高级塔。world range_offset/menu_offset通过Renderer变换，未恢复原.2秒camera.tween与全屏fit_screen缩放，不声称边界镜头完全一致。

原game_gui3117–3315开/关.12outquad，开启.6->1（父max_scale已在尺寸）、alpha0->1，结束才操作，关闭inert与清理；原3804–3824建造/升级/出售先select再confirm，rally直接confirm进入选点。保持真实World.build/upgrade/sell/setRally与稳定按钮id，成功交易按原deselect；不足金钱使用原disabled图/灰check/灰price但允许查看选择，World仍拒绝购买。价格hud10/原黄色255,224,0、灰156,146,132、button bottom-11；不再覆盖“升级●/最高等级”等原型文案。菜单重开/切换/暂停/通知/场景切换取消旧tip/动画，不推进World时钟。阻止pointerdown原生focus滚动，reset清固定game的DOM scroll，防HUD被浏览器移30px（不改变地图pan）。

原tooltip九片/标题/正文/属性图面与原中文已接，法师伤害含loops、兵营HP/伤害/护甲；统计从本局World克隆模板读取真实天赋值，百科依旧基础值。原200宽、左右以entity+12及ring*.62*max_scale定位，正文测高与.9字体高度换算仍浏览器近似；底部infobar、预览塔/升级射程与halo/完整相机适配未实现，不能称整个塔UI1:1。

新查明但本批未改的原出售差异：原game_gui3832–3942提示准备波0为spent全退，其他波km.round(spent*refund_factor)，当前World.sell仍floor*.6。此批提示先显示当前实际到账（用原译文），不显示无法兑现的原退款数；后续须以源规则独立校准领域/完整买卖回归，不能为旧278预算策略保留错误实现，也不能只改提示冒充修复。

215领域测试、九模式完整browser三战役三星、原塔百科/UI/公开Pages UI/guidance/HUD专项通过。新tower-menu专项真实两次建造/升级/出售核对账目、勾选/直接rally/取消/重开/手机/0金币灰图与拒绝成交；阶段3解锁与低资金状态为受控UIfixture，独立九模式自然XP链仍过。campaign-browser按真实两次点击及升级后重选塔出售，保持原350->278旧规则预算本批未动。桌面/手机截图为当前实现非原版同步。初次专项误在首关验证被规则锁定的升级，已改合法第三关；替换时误删deselectWaveFlags与测试批量编辑语法错误都已修复，相关专项重跑通过。整体仍in_progress。

### 0.2.51 原出售退款与构建遗漏修正

实际all/systems633–802的出售分支确认：wave_group_number==0退tower.spent，其余退km.round(spent*refund_factor)；macros44–46的round为floor(x+.5)。波次协程在真正发首组时写wave_group_number=1，对应World.startWave把wave从0变1，不按等待秒数判断。原模板spent=0，level_utils346–362未传初始花费也设0，预建塔不因标价而凭空获利；systems升级分支把原spent加实际扣款后传给新塔。

新增纯towerRefund(spent,refundFactor,wave)，World.sell与TowerMenu原文共用，读取实际模板refund_factor而非写死.6。准备期买70+升级110再卖退180，第二关预算恢复350；发首波后同塔退108。修正此前“准备期净损72是应有规则”的错误判断，历史278预算断言改源规则350；不保留错误退款来适配策略，未修改敌人/冷却/三星阈值/经验。源因子、半数舍入、等待/重复买卖防套利、预建0、仅升级花费、折扣实际支出、暂停/终局拒售新增5项领域测试。

线上QA发现0.2.50打包清单未加入tower-menu.mjs：公开文件实际404，import失败，先前仅本地web目录回归和旧公开0.2.49 UI通过，不能证明0.2.50部署可运行。这是明确发布缺陷，本批修正为自动复制web顶层全部mjs，并在构建时检查相对import均存在。直接以build目录HTTP8766运行UI、真实退款专项及完整九模式，不能只以web目录验证。0.2.50私有/Pages曾受此缺陷影响；0.2.51必须完成同Site/Pages同步后交付。

退款专项截图同时发现固定game的hidden仍允许浏览器scrollIntoView产生30px DOM滚动。game改overflow:clip，禁止固定画布DOM滚动而保持原裁切与子对话框自身滚动，地图仍用transform pan；专项断言game.scrollTop=0并在原通知.4退出完成后采样，不跳过原动画。底部infobar/镜头fit尚未补齐。

220Node与web目录九模式三战役三星、塔菜单/UI专项通过；build目录UI、实际两次卖塔的准备180/首波108/预建0手机专项通过。截图是当前受控操作取样，非原版同步。公开0.2.50 UI检查如实失败（模块404），不声称远程新版通过，不循环等待CI；整体继续in_progress。

最终build目录完整九模式也已通过，三个战役三星；上述构建验证已完成，非仅启动检查。退款专项桌面/手机最终截图已查看，通知退出后正常取样且固定画布无DOM滚动。未声称公开0.2.51已上线，推送后不轮询外部CI。


## 0.2.52 原选塔底部信息栏

核对game_gui.lua:744–747实际hide、748–793 show、808–866更新；795–807是show_text，不能误作hide。手机塔类型3/5只显示原伤害与射速分档，兵营类型4显示生命、伤害和紧凑护甲CArmorSmall，原phone分支跳过射程与复活时间。原肖像、名称、两段背景、图标和字体节点来自infobar_view；读取本局World克隆模板，百科仍读基础模板，不改变建造/升级/出售/集结规则。

原resize将底栏居中于powers右端与bag_button左端之间，保留背包预留位置但不伪造背包功能。screen_utils.lua:11–38与phone常量确认GUI_REF480×320、aspect范围1.5–2.165，新增本栏原参考窗口换算与窄/超宽留边；使用真实game内尺寸，不能读取无布局高度的battle-ui容器。shown_y320/hidden_y358、anchor147/32、294×28，显隐均0.4秒out-back，从当前偏移重入。选塔显示、成功交易/取消/暂停/通知隐藏，场景切换清理；尚未接入英雄/敌人/空地show_text分支。既有圆环与其他战斗HUD仍有693坐标空间近似，不能把此栏校正称为全UI坐标完成。

223项Node单测包括12塔名称/类型/肖像、真实天赋伤害与手机护甲、原viewport边界。专项通过真实预算内建造/升级/两次退款、兵营与石环III、取消/暂停/通知和手机；解锁第三关为受控UI进度，未增加金币或经验。实际build目录的底栏专项、UI与完整九模式通过（三战役三星），公开0.2.51原UI启动也已确认通过；截图是当前实现取样，Love基线/文字测高、原版同输入逐帧尚未验收，整体仍未1:1。


## 0.2.53 手机塔圆环与提示框参考尺度

game_gui.lua:91–112由screen_utils.clamp_window_aspect初始化sw/sh/gui_scale，1424–1432的w2u把世界投影除以gui_scale后加sw/sh中心；圆环3117–3279按原range_offset与menu_offset后四舍五入位置，最大scale0.88。当前圆环与200宽提示框改用已有phone480×320参考窗口与aspect留边换算，不再除以693；补齐圆环原x偏移，保留原节点/hitbox随父尺度一致，未改World交易。TowerMenuTooltip3948–3963按实体y+12定位、右侧空间不足切左、中心ceil后再减半宽/高；缩放或viewport变化会刷新当前菜单和提示，避免只更新绘图而点选范围仍旧。

225项领域单测通过，新增源坐标/超宽留边与提示左右边界和ceil回归。build目录真实菜单专项、底栏与完整九模式通过（三战役三星），保留原两次交易；退款回归结果另记本轮评论。新尺度桌面与手机截图已检查，仍为当前UI受控样本而非原版同步证据。原.2秒camera.tween的平移/缩放尚未接入，边缘菜单仍可能超出画面；未用CSS夹紧假冒相机。其他HUD仍有旧参考尺度差异，字体测高/基线也尚非Love逐像素。原开关0.12秒保留，现归一化缩放起点与原绝对0.6到0.88的幅度仍应继续校准，整体不称完整塔UI1:1。


## 0.2.54 原塔菜单相机适配连续分支

新增battle-camera.mjs，按game_gui.lua:3199–3279的fit_screen_factor1.2/1.3、ring122/max_scale.88/gui_scale、实体原点、clamped_h与pan_extension计算选塔相机目标。核对game.lua:117–143的clamp/tween/cancel_tween，采用phone最大zoom2与0.2秒in-out-quad，从当前姿态重新插值，保留上下扩展。公式在现有Renderer物理参考框架内换算；初始世界铺图/中心512,384/k7/6仍为既有基线，并未称已复原完整原game初始camera/min_zoom与全部宽高比配置。当前前三关初始1倍画面里多数塔不需要移动，不能为演示而强行移动。

Renderer在统一Canvas上下文上变换地图、单位、射程和效果；外部screen/world使用同一相机投影与逆变换。塔位/魔法花DOM中心、波旗世界位置、菜单与tooltip逐帧跟随；guidance继续查询同一Renderer。关卡资源提交时reset相机，旧加载current检查仍在；World坐标、寻路、RNG、金币和技能不变。没有将圆环单独CSS夹紧。尚未实现用户捏合/自由拖动、完整原初始相机和其他HUD参考尺度，开关菜单绝对scale幅度差异仍保留待校准。

227领域单测通过，新增fit分支、.2时序/重入/限幅/投影逆变换。构建目录相机专项在受控的合法2倍zoom姿态选择实际边缘塔，真实点击建造/出售/集结，验证Canvas/DOM对齐、暂停、手机和新关重置；2倍姿态由测试设定，当前产品没有假造捏合交互。测试首次错误地用点击区域中心代替原80%高度锚点，另一次选点离道路过远，均修正测试后正常真实点击通过，未改World规则或force绕过遮挡。截图是当前受控相机取样，非原版同输入同步证据；整体仍非1:1。

实际build目录完整九模式（三战役三星）、原塔菜单、相机专项、scene-transition与guidance均通过；公开0.2.53 UI通过。原always教程和自然XP链保留，未通过预置已读绕过。


## 0.2.55 原相机真实滚轮与触摸输入

核对game_gui.lua:2207–2411 TouchView：wheel down/up分别乘0.9/1.1；两指按新旧距离比更新zoom并clamp；单指位移严格超过drag_threshold2*gui_scale才累计pan目标，逐帧以0.6追随。保留6个速度样本，释放时平均速度超过1才用duration0.5/factor0.5/out-quad惯性，按原zoom换算位移；鼠标按原update每帧采样，包括停住后的零位移，避免旧速度造成停住后仍甩动。新camera-input.mjs保持输入与World/RNG分离，BattleCamera.tween新增可选时长/曲线，既有菜单fit默认.2inoutquad不变。

Canvas/塔位接真实Pointer Events，滚轮原逐格倍率、浏览器CDP双触点都能触发；touch-action:none禁止浏览器页面抢走原战场手势。拖动后消费当前点击，下一次正常按下重新允许点击；pointercancel/blur/切场景清输入，新按下即清旧点击抑制，防触摸取消后吞掉下一次UI点击，暂停/通知/场景门与技能瞄准期间门控，不添加假缩放按钮。浏览器事件分发与KUI窗口10*gui_scale点击识别尚未逐帧等同，现消费规则以TouchView阈值为准，不能称完整KUI触摸复现。

230项Node单测通过，新增原倍率/两指比/边界、严格阈值/.6跟随/.5惯性与取消。构建包真实滚轮、鼠标拖动/惯性、暂停门控、CDP手机捏合与单指拖动、拖后不误建/正常两次建造、重开关重置已验证。截图来自真实输入后的当前状态，并非受控直接设置zoom，但进度解锁为UI专项fixture；不是原版同输入逐帧证据。原初始世界尺度/宽屏min_zoom和地图铺图关系仍沿用前版基线，尚未恢复；整体继续未1:1。


## 0.2.56 原世界参考、战斗纹理比例与初始镜头

核对all/constants.lua REF_W1024/REF_H768、TEXTURE_SIZE_ALIAS.ipad768/iphonehd960和TEXTURE_SIZE_FACTOR.iphonehd.game0.95；game.lua模块ref_res=ipad，director.lua:187–196的get_texture_scale先ref_res/texture_size再除item factor，因此战斗纹理ref_scale=768/960/0.95（约0.842105）。这不是UI的0.5，也不是旧Renderer位置倍率7/6。read_world_rules.lua只执行constants声明导出world-rules.mjs，完整extract_campaign已接复现。

原render_utils.lua:31–52按REF_H反转y，并把纹理ref_scale乘sprite.scale；game.lua:70–170/711–1230再乘game_scale与camera.zoom。Renderer初始位置改为世界x*game_scale、(768-y)*game_scale，正常game_scale=screen_h/768；背景StageXX_0001以原512/384中心、完整图像尺寸*ref_scale*game_scale绘制，前景StageXX_0002原有独立分支继续同缩放。独立go_stage03_bg.lua明确原图1672×1014，未把它误当世界尺寸。只对战场Canvas精灵乘世界纹理比例，UI icon/肖像Canvas维持自己的图面尺寸。

worldViewport按原ceil可见宽度及4:3..16:9限制推导wl/wr/ww/wh与超宽min_zoom，BattleCamera.clamp使用这些源边界和上下pan_extension；reset回原初始姿态再clamp。Canvas画面、DOM塔位与screen/world逆变换共用新投影，不改World坐标、速度/HP/金币/冷却。现页面仍以固定1672:1014游戏viewport展示，其他设备全屏宽高比接入与安全区尚未完全复现；不能把纯函数宽屏分支称为所有设备实测。

233项Node测试通过，新增原常量/比例/宽屏min_zoom、初始中心/逆变换、背景/战场精灵与UI icon缩放隔离。构建包完整九模式（三战役三星）、真实camera-input、battle-camera、infobar专项通过；公开0.2.55 UI通过。原相机专项旧受控2倍姿态需把x移60使目标在新正确视野内，真实交互仍不force。数值测试的Lua导出精度和浮点乘法使用epsilon比较，不改源规则。桌面第二关与手机第三关截图已查看，均是当前原投影实现的取样，非原版同输入同步像素证据；整体仍未1:1。


## 0.2.57 原顶部统计、暂停和英雄/通知GUI分组

核对screen_utils.lua:72–81与HUD_SCALE_STEPS=[[2.053125,1],[1.775,1],[0,.85]]，game_gui init模板ctx将hud_scale单独用于powers等对象；顶部hud_normal_view、pause_button、hero_portraits_view本身没有该scale，使用window GUI尺度，不能整层乘.85。extract_ui新增battleTop原HUD完整标签/暂停/reference/分档元数据；新增原hero_portraits_0001图面尺寸，英雄沿用现有HP/XP/死亡绘制，只校准父坐标与尺寸。

BattleTop按实际game窗口的480×320参考布局：HUD anchor(-6,-8)/112×38，原三标签pos/size/hud11/颜色/对齐；暂停位置sw-safe.r、anchor(36,-8)/28×28；英雄父anchor(-7,0)/pos(0,54)、肖像42×46。暂停按钮从旧top-actions空容器移回实际battle-ui层，保留ID/点击与按下图。HUDmotion对这些组和通知队列按GUI像素换算原hidden目标，保留.4outback隐藏/.4outcubic返回；能力栏仍沿用旧参考空间，不称整个HUD完成。safearea当前仍0，非零安全区未恢复。

通知队列60/104与图标/间隔按同一GUI尺度，防与原英雄栏重叠；首波TB_NOTI原offset60/86提示只校准GUI锚点与尺度，其他世界/技能引导触发和移除不变。原enemy专项force仅为跳过呼吸稳定检查，现在须等待HUD原进场完成再点，避免force把仍在屏外的图标当可点；没有删动画或预置seen。其他HUD/能力气泡仍有参考尺度差异，字体基线/测高仍浏览器近似。

237项Node测试通过，新增原GUI几何/与独立hud_scale区分/手机间距；build目录顶部专项真实暂停、文本fit、桌面/手机、教程隐藏返回、重入通过。完整九模式及原HUDmotion/敌通知/指导回归见本轮结果，截图为当前实现取样而非原版同步像素验收，整体仍未1:1。

最终构建回归曾在第三关战役天然XP4705、准备5帧时仅17生命；6帧则三星。合法策略现在对最后一波保留雷电出口防守，并只对已训练齐射的第三关战役用连接道路到最终出口的剩余距离排序；其他分路方案保留局部优先级。新增实际观察XP4705/4897×9种准备帧共18场三星回归，所有旧领域断言保留，不改World/金币/HP/冷却/三星阈值。探索XP4500/5100的部分长准备组合仍不稳定，不宣称所有XP策略均稳健。

## 0.2.58 原技能组独立HUD尺度

screen_utils72–81按真实窗口w/h选择HUD_SCALE_STEPS，当前固定游戏比例对应.85；game_gui init的ctx.hud_scale只应用powers父节点。原resize把powers.pos放safe.l/sh-safe.b，parent180×60/anchor0,60，三个PowerButton位置(-8,0)/(46,0)/(100,0)，原144像素图按UI ref_scale.5为72逻辑单位。battlePowerGeometry将父anchor、子位置、图面与hitbox一起乘hud_scale*gui_scale；父节点隐藏位移60仍仅乘gui_scale，不额外乘.85。顶部统计与英雄组不跟着缩小。extract_ui新增battlePowers源父/按钮/分档元数据，未将read_ui缺ctx时的scale空表当真实1。

TB_POWER1/2/3按原TutorialBalloon初始化4430附近非world分支，GUI bottom-left加原offset30/80/130,-46，气泡不继承powers的hud_scale，保留脉冲、真实点击触发与World道路引导。技能Canvas冷却/门/亮光绘制、World技能与HPXP规则不变；没有新增假能力。原非零安全区与全设备viewport仍未恢复，字体后端仍近似。

238领域测试通过，新增独立分档阈值/父子锚点/隐藏位移回归；实际build技能专项验证正常双击波旗、原TOWER_LEVEL3确认、援军真实两单位/冷却禁用、瞄准取消、暂停、教程恢复与手机重入。初次专项只点波旗一次仍ready导致disabled等待，已改真实第二次点击，没有force或改变产品门控。原guidance/hud-motion和最终完整九模式结果见本轮评论。截图为当前实现非原版同步像素证据，整体仍未1:1。

## 0.2.59 英雄选择信息栏

原kr3/game_templates hero_elves_archer.info.fn明确hero_basic.get_info_ranged（只读日志artifacts/kr3-template-info-bytecode.txt21423–21430），common/scripts1347–1359返回STATS_TYPE_SOLDIER2、实时HP/最大HP、当前箭伤害、护甲、完整dead_lifetime。game_gui748–793在phone有health时选with_health；817–866更新health_bar比例、%i/%i、damage_value_desc、CArmorSmall与%i s。808–816英雄死亡仍更新而普通死亡实体取消。read_tower_menu导出soldier/enemy常量，extract_ui补原portraits_hero_0001，不执行控制函数。

Infobar选择英雄沿用现有targeting==='hero'（肖像/键盘/现有世界点击），绘制原with_health、士兵三属性和原name/portrait；动态HP血条从左端scaleX，等级变化读取World真实等级伤害/最大HP，不把源码算法放产品文案。真实移动成功后沿用现有选择取消，暂停/通知/场景切换原显隐与.4outback保留。完整原单位选择hitbox/跨命令持久选择、敌人选择与空地show_text仍未恢复，本批不称整个infobar完成。World/经验/战斗数值未动。

239领域测试通过，新增受伤/死亡/源属性与真实flushHeroXp等级更新回归。build目录hero-infobar专项实际双击波旗/确认原塔3通知、选英雄/真实道路移动/取消、受控HP损伤与临近复活时钟/手机/重入通过；该受控死亡样本非正常通关。独立完整九模式（三战役三星）、原塔infobar与本地UI、公开0.2.58 UI均通过。截图已查看，仍为当前实现而非原版同输入同步像素证据，整体未1:1。

## 0.2.60 当前五敌选择与实时信息栏

原game_gui1447–1479 entity_at_pos按ui.can_click与click_rect严格边界收集，1464–1470按ui.z降序、世界y升序排序，1593–1616再检查can_select。enemyAtPoint恢复当前五种敌人间此规则，飞行者原click_rect.pos.y50也保留；目前仍先走既有英雄32近距分支，塔位/花由原有DOM处理，未统一所有实体的全局排序，不称完整原selection系统。技能/集结瞄准优先；选敌不改World或导航。showBuildMenu默认清敌选择，选敌路径显式保留；空地/Escape/换塔/技能/暂停/切场景清理，死亡/漏怪/移出World列表由Infobar清理。原entity_marker_controller尚未恢复。

common/scripts448–492 enemy.get_info使用当前HP/护甲、近战damage_factor后ceil或远程bullet伤害、lives_cost和immune；game_gui817–866恢复enemy1的with_health、原肖像/中文、damage/armor/lives，physical非0优先物理icon4，仅physical0且magic非0用icon5；None与lives<=0的-、全免疫CArmor9按源处理。gnawer当前实际buff倍率也用于显示，不读百科base值。源模板的can_click/can_select与五个portrait已导出，未新增伪造详情文字；字体/基线仍浏览器近似。

241领域测试通过，新增严格边界/飞行偏移/z和y重叠排序/死亡漏怪过滤，以及五种实时数据/增伤/护甲图标/None回归。实际build目录enemy-infobar专项正常Canvas点击、实时半血、死亡/漏怪、空地/Escape/暂停/换塔/键盘技能优先级/手机/重入通过；spawn位置/HP为受控fixture，不是天然通关。首次测试只等selected引用未等下一RAF数据重绘，修为同时等待原信息栏key；额外手机技能按钮被五个受控首见图标遮挡，改真实键盘1测试该路径，无force穿透。独立完整九模式三战役三星、hero-infobar、塔infobar与UI/公开0.2.59 UI通过。截图已查看，非原版同输入逐帧证据。整体仍未1:1。

## 0.2.61 原选中实体marker

原common/scripts356–393建立marker快照：soldier（含hero）用selected_soldier_small，enemy按UNIT_SIZE_SMALL/MEDIUM/LARGE用selected_small/med/big；兵营只遍历插入当时已有且首sprite可见的士兵。decal原anchor(.5,.5)、alpha255/z1400，位置引用目标pos并加unit.marker_offset。395–418在done、目标移除/不可选、死亡且非ignore_damage时移除；不对同一次选择的复活/新生士兵自动重新添加。extract_markers.py只读取模板声明和constants生成marker-data.mjs，完整extract_campaign已接入；图帧本就在go_decals，不需重复提取。

SelectionMarkers位于展示层，快照与过滤仅维护引用；Renderer在世界Canvas单位前绘制原marker，并使用同一World纹理ref_scale/game_scale/camera投影。支持当前敌选择、targeting hero、选中兵营已有士兵，取消/换场景/新关加载按current校验后清理。没有World实体插入、RNG/XP/HP/金币/寻路修改。现Renderer全局z排序仍未逐层复原，本批按ground-before-unit绘制，原z1400保留元数据但不声称完整遮挡一致；World也尚无全部原sprite.hidden/动态ui状态，兵营可见判定限于现有状态，不称完整controller1:1。

243领域测试通过，新增原体型/offset/anchor/z、跟随/不写World、英雄/兵营快照死亡与重选回归。实际build marker专项五敌/英雄/真实建造兵营、死亡/切换、真实滚轮放大及缩回、暂停/手机/场景清理通过；受控spawn为展示证据非自然通关。初次测试钢铁未完成战役被原门控拒绝，补进度后又与英雄优先点击区重叠，最终用合法战役准备期；缩放后波旗屏外先实际wheel缩回，不force。完整九模式三战役三星、enemy/hero-infobar与UI、公开0.2.60 UI均通过。标记截图已查看，未取得原版同输入同步证据，整体未1:1。

标记最终取样fixture同时设置原道路节点与对应route.lengths距离，避免仅改x/y后下一步回到入口、被波旗覆盖。marker-browser-ground-final2完整exit0；这是测试证据修正，不改变运行时或部署包。

## 0.2.62 源依据纠正与技能show_text

本轮原计划假定空塔基缺底栏说明，源证据不支持该前提：tower_holder_elven_woods/faerie_grove都没有info，game_gui748–793遇无info直接hide。当前空塔基隐藏信息栏是源行为，不添加“可建造防御塔”或伪造描述；四类基础建造/建成选中/出售后空地状态按真实规则回归。

真实show_text调用位于PowerButton.set_mode(selected)（game_gui约2950/日志10698–10722），使用i18n_title/i18n_desc；取消/进入cooldown隐藏。原setup_hero约1800/日志6960–6978会将第3按钮覆为HERO_ELVES_ARCHER_HAIL_MENUBOTTOM_NAME/DESCRIPTION，不用泛称英雄技能。powerInfobarData从原powers元数据/英雄模板导原key，read_tower_menu导STATS_TYPE_TEXT9，extract_fonts新增POWER_*原中文。Infobar渲染原text_only和type9，标题hud10/背景shape、说明hud10/金色/line_height.9，复用既有CJK实际测高换算，保留原.4outback与font fit；测高/基线仍浏览器近似。

244领域测试通过，新增无info塔基与三技能静态/动态原文规则。最终build目录power-infobar专项正常四塔购买/原退款/重选/空地隐藏、三项选中说明/重复点取消/Escape/暂停/原敌通知打开清选择关闭不自动显示/手机/重入通过；真实施法cooldown专项battle-powers、hero-infobar、23Tips、本地UI与完整九模式三战役三星、公开0.2.61 UI均通过。通知图标用实际鼠标中心点击，无force。截图已查看，是当前取样非原版同步像素验收。World、价格、升级、技能时序/伤害不变，整体未1:1。

## 0.2.63 TowerMenu原绝对缩放幅度

只读jit函数常量补证game_gui3117–3279 show初始scale(.6,.6)/alpha0，.12outquad到max_scale.88/alpha1；3281–3315 hide table明确(.6,.6)/alpha0，取消旧timer后从当前姿态关闭。read_tower_menu导show初始数字常量与hide表到motion元数据，未调用游戏控制函数。之前host几何已乘.88却又直接用归一化.6导致绝对.528，现towerMenuFrames将绝对.6除以max_scale一次，图面与子hitbox同变换；静止仍.88，tooltip为独立原200GUI宽不继承圆环动画。

hide在取消旧WAAPI前采当前scale/opacity，new show按源重新.6/0；回调带动画对象身份保护。TowerMenu同一实体内容/resize重绘保留进行中动画与inert，不再取消后提前可点；transition显式取消旧动画，减少动态偏好仍直接终点。原.12outquad、9位置、fit相机、两次确认/真实退款与World数值不变。

246领域测试通过，新增源绝对幅度/中断关闭与new show重置规则。实际build专项0/60/120ms图面和子hitbox、alpha、中断关闭/重开、真实resize重绘门控、tooltip、购买升级出售、手机/暂停/场景清理通过；完整九模式三战役三星、原tower-menu/scale/UI与公开0.2.62 UI通过。早期专项点不可操作按钮会落空地取消菜单（无扣款），取样改重新选择后测；再次点同塔原产品会取消，重绘专项改用真实resize，不为测试改该行为。截图已人工查看，为受控展示时间取样而非原版同输入逐帧证据，整体仍未1:1。

## 0.2.64 基础建造预览

原game_gui3513–3608 select在preview字段存在时按entity.tower_holder.preview_ids索引设置原sprite.hidden=false，3610–3641 deselect恢复true；没有生成另一座完整塔。四类原预览分别archer/barracks/mage/artillery，alpha180、anchor(.5,.5)、offset(0,34)/(0,34)/(0,36)/(0,26)、z3000均读取原holder模板。holderPreviewOverrides只产生本帧展示覆盖，Renderer沿用世界纹理ref_scale/game_scale/相机与原entity裁图链，不修改World slot、模板或RNG。TowerMenu第一点击选择派生preview，切换、取消、成交、通知、暂停、场景切换清理。两种holder模板均通过渲染级回归；当前前三关原数据均elven_woods/terrain1，未为展示第二种地形篡改关卡。

零金币专项发现旧Campaign.updateBattle仍按余额把按钮设disabled，与TowerMenu原click_disabled“可选中预览、不可确认成交”规则冲突。删除该旧覆盖，仍由TowerMenu源规则锁定未开放塔，价格/图面灰显且真实World拒绝无钱交易。未改价格、金币、伤害或冷却。原选中范围/升级halo与完整z遮挡仍待恢复，本批只闭合原预览图，不称全部建造反馈1:1。

249项领域测试全部通过；实际build预览专项验证四类原图/偏移/透明度、切换/取消、零金币真实鼠标选择与拒绝成交、70建造与准备全额退款、手机/真实滚轮缩放、暂停/敌通知/重入清理。两地形采用Renderer实体级测试，当前关卡未改地形；浏览器中零金币为受控fixture，完整九模式另用天然新存档链。最初跨帧比较slot.cd自然递减误报，改为比较非时间状态；通知专项先按真实规则取消选塔再点波旗，不force。截图为当前样本，非原版同输入像素证据。

## 0.2.65 高优先级冷启动优化

用户反馈进入游戏变慢，暂停下一批范围/halo工作，先建立冷缓存限速对照。旧包在100ms延迟/1,500,000Bps下载、禁缓存条件下：首屏3333ms、进入地图累计10068ms、首次入关另8645ms，资源24,051,298B。瓶颈为整张塔图集6.2MB、地图界面图集2.8MB与CJK原字体约4.1MB，以及元数据/背景串行与ESM深层请求。

构建生成当前依赖的1290帧紧凑塔图集2,027,190B、地图旗帜道路装饰图集431,390B；原全部模板/动画/坐标/trim不改，每张重排裁图按RGBA逐像素验证。未用图集仍保留供将来/图标显式请求，不在入关关键路径下载。字体保留所有已发布代码、布局、中文目录字符与ASCII，保持原全局bbox/hhea度量及原轮廓，WOFF2减少约3.7MB；浏览器原字体与部署字体代表性中文/数字Canvas像素和metrics逐项一致。不是有损画面降质或删除可用内容。原门动画/资源首画等待保留，不用跳动画假装加速。

最终同条件复测：首屏2702ms、地图累计7451ms、入关另5720ms，总计13172ms（旧18713ms，约减少30%），资源13,884,787B（约减少42%）。该数值是受控本地构建网络测试，不是所有真实设备/线路保证。新增15MB冷路径预算与禁止完整大图集/OTF下载回归。251Node通过；最终构建loading专项（原字体像素/metrics）、完整九模式三战役三星/存档/手机、map-start/scene-transition/UI全部exit0。早期新专项被原开场教程遮挡，后正常点击三页教程再测，无force/seen抑制；首次profile写错旧存档ID已修且重测，所有早期结果收集。World战斗规则无改动。

## 0.2.66 APK原字体角色与首帧排版

用户质疑字体，重新逐字节核对APK assets/all-phone/fonts文件：现有NotoSansCJKkr-Regular/Bold、SohoGothicProMedium、Comic Book Italic都与APK SHA-256一致。原font_subst.lua的zh-Hans确实指定NotoSansCJKkr，不将其替成猜测的楷体/漫画中文。原main按global后locale注册替换，extract_fonts顺序同步，并导出每个原文件apkPath/sha256供校验。

查出真实遗漏：global numbers_bold=TOONISH，旧NativeUI只按role==='numbers'/'numbers_italic'区分，numbers_bold错误回落CJK。现提取TOONISH.ttf、注册OriginsNumbersBold，font-roles.mjs按原字体名统一解析全部角色/真实字重/size系数，禁止浏览器额外合成粗斜体；结算原gems_label字体同步（宝石经济仍未开放，不伪造功能）。原CJK中文正文/标题分别Regular/Bold，普通/斜体/粗体数字分别Soho/Comic/TOONISH。

首次显示前与三份metadata并行等待五种原字体就绪，避免font-display:swap期间用系统字形测量并永久保留错误fit/换行；失败保留加载错误状态，不悄悄用默认字体冒充成功。仍采用0.2.65的无损WOFF2及全已发布字符集合，不恢复大字体下载。字体原文件正确不代表Love栅格化/字号取整/描边/基线已全部复现，相关差异仍在；不能把样张当原版同镜头像素证据。

254Node全部通过，新增全角色映射/原文件hash与字体就绪门控。build字体专项人为延迟原字体请求，确认界面等待而不是默认字体先排版，释放后正常进入；手机英雄殿堂、五种原字体与部署字体Canvas像素和metrics逐项一致。第一次加入TOONISH对照时测试复用OriginalComparison家族、缺字回退到了之前注册的另一原字体，改每font独立对照family后通过，不改产品字形/降低断言。独立九模式三战役三星/存档/手机与UI通过。启动预算专项仍13,907,015B、约13.37s（100ms/1.5MBps/冷缓存），保持15MB预算与无整大atlas/OTF请求，不退性能修复。样张apk-original-font-roles.png和手机图已查看，为APK原字形当前展示，不称字体渲染1:1。

## 0.2.67 顶部统计原字号取整与单行fit

只读完整链game_gui91–112把gui_scale写入GGLabel.static.font_scale，GGLabel63–82将逻辑字号乘_font_scale传font_db.f；font_db113–149再乘role.size，结果>6才floor(x+.5)，并用原light hinting创建字体。GGLabel84–151 fit_step默认.5，在逻辑字号空间减步长后重新取字体，不是减固定CSS像素。原HUD三标签均hud11/fit_lines1，parent无独立hud_scale，沿原GUIscale；没有给其套powers的.85。

source-font-layout.mjs封装此取整顺序与单行HUD fit，BattleTop按当前GUI参考渲染像素设置实际font-size，缩放/数值变化时重新计算，取代连续cqw字号与每次.25px缩小。真实金币/生命/波数没有改，受控长数字只改DOM用于验证最大可用字号与原.5网格。普通字号与字体角色/原文件保持，原无text_shadow的HUD也仍无额外黑描边。

修改范围为顶部单行统计字号/fit。基线font_adj、Love getHeight/getWrap完整后端、light hinting与原生高DPI像素关系尚未全部复原；本批当前浏览器GUI参考取整不能当全部设备同步像素证据。GGLabel.draw153–227的top/middle/base/bottom调整链及默认text_shadow=nil、offset1/1已读，未凭感觉添加普遍阴影。多行正文仍待后续。

256Node全部通过；实际build source-font-layout专项验证桌面/手机/resize原整数参考字号、原.5逻辑步长、上一步不能再fit、World金币不变、暂停与三页教程后恢复；battle-top/五种字体原件Canvas像素一致性、最终完整九模式三战役三星/存档手机均exit0。启动冷缓存预算13,908,960B/约13.40s，15MB预算与无整大atlas/OTF继续过。公开Pages本轮manifest0.2.66且完整test:ui通过，上轮入关超时没有重复；新0.2.67推送后不循环等CI。截图source-hud-font-mobile.png已查看，是当前实际界面非原版同输入逐帧证据。


## 0.2.71 桌面第一大陆地图连续分支

指定视频第8P开书前彩色地图与当前phone英文纸图明显不同。本批使用固定社区混合源 a1facc6b76d00b064ad43db958d31b4ceaf7388d 的KR3 desktop screen_map_123原图声明，仅提取原基础地图0001、村庄under遮挡0003、未解锁山体0002、旗帜/星/路径/首次提示原图。不是APK desktop资源，不执行或移植mod控制器、数值/AI背景。tools/sources/desktop-map.json记录源sheet SHA与只读points声明；extract_desktop_map.py每裁图/紧凑打包按解码RGBA逐字节核对。前三旗(196,204)/(471,312)/(322,407)与2关14点、3关7点路径（按数值id排序）按声明坐标，实际图中村庄/石桥/瀑布路径与视频交叉核对。地图1920x1080参考按h/1080，窄屏按w/1920，与phone640x510和World1024x768隔离。

DesktopMapScene保留现有存档/奖励串行时间/首旗门控与原director资源首帧等待，Canvas/DOM/hitbox/pan共同换参考。旗图88x120居中于源pos；可点子rect(20,34,44,74)与完整图面分离，避免clip切掉星。hover用180/181/182帧，挑战白旗与英雄翼读真实进度，未来关不造入口。首次提示换原desktop图片与中文，源.5inquad/轻摆。World/价格/寻路/冷却/XP没有改。

这是第一大陆与前三入口的可用连续迁移，不是全desktop地图完成：其余背景移动层/船/树/粒子等动画尚未迁移，旗待机随机动画尚未完整复现；旧phone顶部/底部菜单与提示仍保留，布局与指定视频不一致。奖励时序沿用既有phone串行实现，不能称desktop原协程逐帧一致。完整遮挡、vignette、窗口safearea仍欠，截图非原版同输入同步像素验收。

高清图首次让15MB冷路径预算失败（16,655,777B），没有减画质或调高预算。去掉当前未使用的旗待机中间帧关键下载，原资源完整源声明仍保留；构建对catalog/ui/fonts三份JSON无损gzip，浏览器DecompressionStream解码，原JSON作为无API兼容回退。更新后的受控同网络测试14,583,874B/约13.9s通过；最终包仍需按最终日志报告。此前测试wait旧phone atlas字段已改为等待当前desktop源图就绪，不把缺字段当网络或放宽输入门控。


最终268项Node通过，包含gzip三份声明还原与不支持解压API时原JSON回退。实际build桌面地图专项真实前三旗→书页→入关、源图面/hitbox与手机CDP触摸通过；UI专项原phone纵向拖图假设改为desktop真实横向wheel/drag及限幅，保留旧public版本分支。首次领域测试把1600×900错误期待scale1、路径忽略原数值id排序，均按源修正，未改产品规则迁就断言。两次并发浏览器在断言全部通过且Chrome退出后Node句柄残留，已比daemon后精确TERM owned26178/26239并收集；独立最终touch专项exit0，最终完整campaign另行重跑，不能把被TERM进程说成正常exit0。

最终完整build九模式、三战役三星/真实存档手机、test:ui、test:desktop-map全部exit0；第三关campaign自然XP4705/准备约6帧20生命。最终冷路径100ms/1.5MBps/cacheoff为14,585,235B/13.915s，未调高15MB预算，全部新图RGBA无损。公开Pages本轮一次manifest确认0.2.70且旧版test:ui通过，0.2.71推送后不循环等CI。desktop-map-first-continent.png/mobile.png已人工查看，为受控三星解锁当前UI取样，不是原版同输入逐帧证据。整体仍未1:1。

## 0.2.72 桌面地图顶部统计与真实设置入口

原桌面screen_map.init设置按钮三帧map_configBtn_0001/2/3，130×130、anchor65/65、pos80/70，旧共用desktop源码与KR3声明一致。StarsBanner原mapStarsContainer312×62、anchor156/0、pos(sw-190,30)；数字不是GGLabel字体，而是原32×32图片，左侧逆序20步长、slash在x131、右侧110正序。totalStars读取真实战役星及挑战星，原max_stars110，不沿用原型/15；桌面此处无原型宝石0栏，因此移除，未造宝石经济/商店。

新增desktop-map-hud.mjs，在desktop-map元数据/atlas就绪且场景owner仍匹配时创建。与地图拖图分离，参考1920×1080，复用原screen_utils最小4:3/最大16:9和origin分支，按game.clientWidth/Height计算，完整Canvas保留原图片；同一原atlas新增15帧逐RGBA无损验证。source数据与字段写入tools/sources/desktop-map.json hud声明，全量提取可复现。不执行社区mod控制器/数值。

gear正常/hover/pressed、离开/cancel/blur回图及真实设置按钮接通；原共用screen_map:keypressed确认空地图Escape开设置，已有modal则关闭。退出放到设置内，关闭modal后通过既有returnToMenu/SceneTransition门回标题，不再地图左上wood返回。director专项改真实先点齿轮再退出，原慢准备/重复拒绝/输入门控/slot取消检查保留。设置窗口内部仍是既有phone设置与暂置退出按钮，并未称原desktop OptionsView完整复原；底部三按钮/提示也仍phone，下一批迁移。World/买卖/金币/XP/冷却未动。

看图另发现0.2.71把未解锁旗的旧phone base态误画成desktop红旗；按原show_flags仅创建已有level，修为未解锁id隐藏且不可点，当前三星入口不变。截图受控统计fixture造5战役星+2挑战星验证7/110，真实进度演练与九模式独立，不作为正常通关证据。首次geometry测试误含#game的4px边框，改按原代码一致的client区域计算，未放宽源坐标误差或改产品位置。截图需等待原底部入场.5秒结束，避免截到半入场误判。


270项Node通过；最终实际build test:desktop-map-hud、test:director、test:ui正常exit0。专项源图片数字/战役挑战统计/齿轮0-1-2态、Escape开关、真实音效/音乐开关保存、设置退出走门、slot1/2隔离与重载、手机CDP触摸通过。截图desktop-map-top-native.png/mobile.png已查看，前者受控5+2星而非自然通关，后者slot2新存档；底部phone控件仍明显待迁移。首次最终campaign等所有flag canvas元数据，因隐藏的未解锁旗保留未绘制占位key而超时，改只检查实际可见flag（隐藏/禁用另有专项断言），没有force/跳过教程或修改World。

最终冷路径100ms/1.5MBps/cacheoff14,635,898B/14.841s，保持15MB预算，不是所有线上设备保证。公开Pages本轮一次manifest确认0.2.71，新gzip元数据真实线上启动及完整test:ui通过；0.2.72推送后不轮询CI。

最终同一build完整九模式、三战役三星/存档手机回归exit0，3campaign自然XP4705/准备约5帧20生命，无改策略/战斗数值。最终日志map-hud-tests-final.log、map-hud-browser-complete.log、map-hud-director-final.log、map-hud-campaign-complete.log、map-hud-ui-final.log、map-hud-performance-final.log、map-hud-pages-ui.log。所有owned结果收集，整体仍未1:1。

## 0.2.73 桌面地图底部真实入口、字体与提示

原desktop screen_map.init三入口中心hero(sw-610,sh-90)/upgrades(sw-440,sh-90)/encyclopedia(sw-270,sh-90)，保留右侧成就sw-100原空位，不把三个按钮向右挤齐。原图226×184，anchor113/92，子label50/121、126×30、font18。原共同GGButton.initialize确定button角色、按下.95、default233/233/178、hover246/228/132；原zh-Hans font_subst映射button为JIMOJW×1.2。desktop-map-actions.mjs使用独立desktop角色，按实际GUI比例进行源物理字号取整与.5逻辑fit，未替换phone全局字体。JIMO兼容原件（仅去竖排表、横排原样）的所有按钮字形cmap存在，build subset由真实三按钮文案扩充；map资源门并行等待JIMO与图片，取消用既有owner验证，不加启动5faces门/默认字先测量。

原normal/hover图hero1/2、升级10/11、百科7/8，hero portrait同226×184原0/0叠图；保持原encyclopedia→upgrades→hero插入顺序及交叠hit区。原GUIButtonCommon与真实heroRoom/upgrades/encyclopedia函数，点击提示即时hide、不沿用phone渐出。各入口没有假购买/新角色；技能点与升级星分别读真实skillPoints/availableStars，不混预算。原badge图52×48与62×58，中心hero+40/-45、upgrade+20/-50、Comic Book Italic22。共享原update明确stime+=dt*10，hero pulse .95+.05sin(stime)、upgrade .8+.05sin(stime)、hint .98+.02sin(stime*.5)，不是旧phone三角pulse/额外入场。控件源init直接显示，不套phone .5入场。

原desktop升级提示与英雄提示为独立分支，可同显；英雄升级条件>=首阈值1300，首次实际展示保存map_skill_tip，兼容旧map_balloon_level_up_view已读值并同步写，避免旧存档重弹。hero新解锁仅支持真实Eridan，不给未实现Arivan造提示。原3张专用hint图/原中文、坐标、蓝标题Noto/body与正文lineheight从源读取；原图/按钮数据收在desktop-map.json actions并逐裁图/打包RGBA验证，按固定社区资产源/原共用源码交叉，非APK desktop提取。phone MapHeroHud与纯helper保留为旧profile；runtime改DesktopMapActions。旧map-hero browser按新边界/独立双提示/资源完成等待/横向pan更新，未伪造正常战役XP。

GGShaderLabel p_glow的实际Love shader仍未完整实现，按钮使用明确黑描边近似（1.8*1080/768的参考厚度），font raster/基线/多行fit仍存在浏览器后端差异，不宣称逐像素一致。成就/完整desktop OptionsView/其他地图动画、vignette等仍未完成。预览截图为受控1300XP/六星UI验证，独立九模式用天然XP链，不把受控进度说成正常通关。

272项Node全过，实际build test:desktop-map-actions（最终含原交叠区域命中hero优先）、原map-hero浏览器专项、test:fonts、test:ui与最终完整九模式三战役三星/存档手机均正常exit0。专项真实hero训练4→2点、六星预算买原1星天赋后6→5、三入口/重入/seen兼容/同时双提示/手机CDP触摸；源JIMO所有按钮cmap字形存在，兼容原件与部署subset Canvas逐像素和metrics一致。初版专项错误寻找升级页通用data-close，改点原tutorial-upgrades_done_button并实际购买，无产品门控改动。第一次campaign九模式断言全过后browser.close残留Node，已比daemon精确TERM owned30317并收集143；finally改先page.close再browser.close，最终独立完整九模式正常exit0，不冒称被TERM那次exit0。

最终同网络冷路径100ms/1.5MBps/cacheoff14,744,507B/14.950s<15MB，未调高预算或降画质。公开Pages本轮一次manifest确认0.2.72且完整UI通过，0.2.73推送后不循环等CI。最终logs map-actions-tests-final.log、map-actions-browser-complete.log、map-actions-hero-final.log、map-actions-fonts.log、map-actions-ui-final.log、map-actions-campaign-final.log、map-actions-performance-final.log、map-actions-pages-ui.log。desktop-map-actions-native.png/mobile.png已人工查看，为受控UI进度非原版同输入逐帧像素证据，整体仍未1:1。


## 0.2.84 桌面存档侧滑与真实删除

DesktopSlots恢复原slot_panel在banner后方x0→160、.1 outquad；三槽427/92、431/191、435/292，中文原位图normal/hover、原down偏移及旋转统计组。读取真实槽数据，战役与挑战总星/110、英雄/钢铁数量不伪造；phone旧SlotView仍可显式回归。删除独立原确认图片与原中文，按需JIMO，不加入启动字体门。来源固定原社区资产与vanilla只读控制器交叉，不是phone APK桌面提取。

原delete_view没有命名back，PopUpView只给shade做.5/.25 inquad，面板保留中心上50逻辑像素，不能套book位移。首次看截图发现CSS relative top错误叠加50%导致底部裁切，修为相对居中偏移-50×scale，并补桌面/手机源中心及完整可见断言。删除真实repo目标槽并清对应mapSeen/mapHistory；删除当前槽同时重载空progress防旧XP复活，其他槽保持。关闭/快速重开/资源未完成时取消与场景切换用owner/request保护。

背景与独立logo、标题设置内部仍phone，不称main完整desktop或原版同步像素完成。字体shader/基线仍浏览器近似。

301项Node通过；最终实际build desktop-slots/UI/完整九模式、三战役三星及存档手机正常exit0，第三campaign天然XP4705/20生命。原desktop-title、显式phone slots/MenuMotion专项分别过。首次campaign旧同步count在lazy槽图片未完成时0≠3，改等真实首槽；旧phone专项reload后默认desktop，显式恢复phone profile后过。截图均已查看，受控槽进度不是自然通关或原版同步像素证据。最终100ms/1.5MBps/cacheoff冷路径14,898,765B/15.265s<15MB，非全线路速度保证；公开本轮一次manifest0.2.83及完整UI过，新版推送不轮询CI。


## 0.2.85 原桌面完整背景与按需GUI

DesktopTitle恢复main_menu_bg原1920×1080图（内含左上原标志），源screen_slots.ref_h1080、bg_view.anchor960/540、pos sw/2/540；使用同一h/1080与居中origin，而非phone背景cover或World比例。移除desktop独立phone logo，并禁止对应CSS背景和phone start预载。背景先于slots/banner绘制，slots改插在background之后、banner之前，真实侧滑/命中/场景门/旧请求取消保持。returnToMenu桌面分支只等DesktopTitle资源，不误取phone start；显式phone profile保留旧图与MenuMotion。

原背景无损WebP2,222,858B与固定screen_slots-1.png的完整1920×1080区域在浏览器Canvas逐RGBA相同，模板/PNG SHA在desktop-title.json来源中复现；原控制器仅读。共用vanilla仅KR2中文subtitle条件可见，KR3不额外叠该图。缺指定视频同一开始帧，所以只称源图与浏览器一致，不称视频逐像素验收。标题设置/名单内部仍原现有实现，完整desktop界面尚未结束。

为留出下载空间，部署optimizer将gui_common-1..4与gui_portraits-1的494帧分为461个按需文件，原animation prefix归同组，静态icon独立；每帧保留size/trim/全部原像素，逐裁图RGBA验证，原大图与其他GUI目录仍保留兼容。Renderer原sheet/icon按实际使用载入，WaveFlag/BattlePortraits/ResultMotion已有完整依赖载入，未删帧或改世界数值。先试整体GUI重包仍约1.98MB，最终采用真实按需分组；不是假延迟背景或跳动画。浏览器额外比对背景全图与静态/动画GUI原图q、size/trim，并验证手机/原door/槽2返回。

301Node通过；UI远程首轮沿用同步count在lazy槽未完成时0!=3，改等真实首槽后公开0.2.84完整UI过。无force/教程抑制。最终背景/slots/UI/powers专项正常exit0，冷路径100ms/1.5MBps/cacheoff真实book入关14,157,012B/14.355s，旧phone title与整GUI图集未下载，15MB预算不变。桌面/手机截图已看，为当前UI取样非原版同输入帧。

最终完整九模式三战役三星/存档手机正常exit0，3campaign自然XP4705/20生命；原phone MenuMotion、字体和波旗奖励专项亦正常exit0。最终日志title-bg-tests.log、title-bg-build-final.log、title-bg-background-final.log、title-bg-slots-final.log、title-bg-ui-final.log、title-bg-campaign-final.log、title-bg-powers-final.log、title-bg-wave-final.log、title-bg-fonts-final.log、title-bg-motion-final.log、title-bg-performance-final.log、title-bg-pages-ui-final.log。未改World/策略/RNG/HP/gold/XP/cooldown。


## 0.2.86 原主菜单设置与实际音量

原vanilla screen_slots.options_view与KR3布局交叉：main_options_bg_notxt700×370，child99043 anchor350/185、窗口中心上50逻辑像素；无命名back，不套book滑动。PopUpView仅遮罩80→160/.5与当前值→1/.25 inquad，即时可操作，关闭立即inert并取消旧回调。原header232/15/242×50、h_popup28×1080/768；SFX250/100、Music250/190，原h20×1080/768；两VolumeSlider139/132与139/222、422×34，Done中心350/273与194×76。原JIMO角色×1.2与物理字号取整/宽度fit，shader/基线仍浏览器近似，不宣称逐像素。

新增desktop-title-options.mjs、options.json/原背景裁图；tools/sources/desktop-title.json记录完整源布局/原中文Done=完成/SHA，提取器逐RGBA验证，接全量提取；其余slider/button直接引用已验证options原图。JIMO subset补齐实际主菜单四文案，所有字形cmap已查存在。独立screen_settings系统配置模块不在本批，未伪造分辨率/账号/商店或导mod新增功能。新设置资源仅点击选项才加载。

MapOptionsView的原滑杆绑定抽为bindAudioSliders，两设置分支共享pointercapture/正常-悬停-按下帧/0..1实时gain/键盘可用；主菜单Done遵照screen_slots532–546只保存全局volume_fx/music，不调用repo.save，避免从标题设置制造槽。Escape按源631–650只hide，保留本次会话实时gain但不写全局配置，重载回上次Done值；地图原close即保存策略保留。旧未configured sound:false有效值保留，Done先捕有效两值再确立全局权威，不因新槽默认值压掉音量。

303Node通过；新纯测全局保存不触碰槽与遮罩中断值。实际build主菜单专项受控250ms遮罩100/255/静态源中心/完整可见，真实FX键盘.25/音乐鼠标.65→实际Audio.menu.volume .13、Done保存但空槽仍空、Escape不保存/重载/跨槽、旧close被新dialog取消、pending请求Escape取消不复活、手机CDP拖动均正常exit0。桌面与手机截图已人工查看，为当前UI非原版同步取样。地图Options共享滑杆兼容专项、UI亦正常exit0。

最终完整九模式三战役三星/存档手机正常exit0，3campaign天然XP4705/20生命；原title/slots/fonts与公开0.2.85完整UI通过。最终冷路径100ms/1.5MBps/cacheoff真实书页入关14,166,792B/15.262s<15MB，新主菜单设置图片未进入关键路径；非所有线上速度保证。logs title-options-tests-final.log/browser.log/map-regression.log/ui.log/campaign.log/title.log/slots.log/fonts.log/performance.log/pages-ui.log。未改World/策略/HP/gold/XP/cooldown，全部owned结果收集。


## 0.2.87 实体逐sprite层级与遮挡

原APK systems.lua1986–2029只读-bl与固定vanilla共享systems.render2116–2159交叉：z升序；sort_y存在（0仍Lua truthy）优先，否则实体pos.y+sort_y_offset降序；再draw_order升序、x升序、完全同键保持原插入顺序。frame.draw_order=100000*(sprite.draw_order或sprite序号)+entity.id；sprite.offset只影响图面，不参与sort_y。extract_render_order.py仅读控制器字节码字段并读constants声明生成defaultZ3000/因子100000/sourceSHA元数据，接完整提取，不执行systems控制器。

现Renderer此前已有实体级y排序，但整塔三层绑定一起且marker固定最先画；现RenderQueue在同一原world/camera transform中逐sprite收集塔地基/上层/射手、scenery、士兵/敌/英雄/modifier/原选中环，按上述键重放。塔terrain1300可先于marker1400，再按3000物体y交错。建造进度条保留完整clip闭包，不把clip状态丢失；现有primitive血条用原hb z/sort_y_offset与背景200002/填充200003顺序，几何仍原现有近似。飞行影子/花冷却文字仍现有primitive，仅纳入实体队列，不宣称它们原图完整恢复。范围3500与弹道/FX/特殊前景仍独立阶段，因此不是全部全局render_frames排序。原完整entity insert ID流未实现，展示ID用原level声明顺序与现World serial偏移作为稳定代理，不能宣称原版全部同y tie ID一致。

306Node通过，覆盖z/y/视觉offset隔离、sort_y0、s.pos/offset、draw_order/x优先级、完全同键稳定与只重放一次。实际Canvas专项验证地基→原选中环→高y敌人→血条→低y塔体/原range调用，并比对绘制前后World seed/serial/time/gold/XP/slots/单位快照不变。真实购买70、等待建造完成后使用重叠敌/半血和冻结世界的受控展示fixture，非天然通关/原版同步证据。首次截图敌位置下一RAF回到道路，最终fixture暂停仅用于展示；实际暂停按钮前恢复fixture paused=false，否则原pause方法正确拒绝重复暂停而专项等待超时，未改产品门控。

最终build原markers/ranges/UI专项与源排序Canvas专项正常exit0，缩放、手机、暂停/场景清理通过；受控截图render-order-overlap.png/mobile.png已人工查看。公开一次manifest0.2.86，首UI在入关等待30秒超时；未改产品或超时值，独立复测render-order-pages-ui-diagnostic.log完整UI正常exit0，不把首失败冒称成功。最终冷路径100ms/1.5MBps/cacheoff真实书页入关14,169,315B/15.280s<15MB，未提高预算/整atlas下载/降质，非所有线路速度保证。

最终同一build完整九模式三战役三星/存档手机正常exit0，3campaign天然XP4705/20生命，World/策略未变。最终logs render-order-tests.log/build-final.log/canvas-final.log/markers.log/ranges.log/ui-final.log/campaign-final.log/performance-final.log/pages-ui-diagnostic.log，早期fixture暂停失败与首远程失败均已收集；所有owned工具结果前台收集。


## 0.2.88 飞行身体与原地面影子

KR3 enemy_perython模板原body anchor(.5,.058823529411765)、offset0、原full frame104×120/大量下部留白，第二sprite为静态decal_flying_shadow/anchor(.5,.5)/offset0/alpha255/z3000。原shadow全图24×8、裁图21×3，catalog/go_decals已存在，没有提取或造新影子。main_script.insert=enemy_basic.insert/update=enemy_passive.update（模板只读-bl44553–44567）与common/scripts494–559/570–608核对；后者只走正常移动/死亡/stun，utils.walk473–519只更新motion/pos，没有额外fly-height/身体offset更新。因此悬空由原图留白和anchor体现，删除旧body屏幕y-25及20×7自画ellipse，改两sprite同world原点、各原anchor/trim/alpha/scale，经原纹理.842105×k×camera链，shadow不跟body水平flip。源sprite z/draw_order仍通过RenderQueue。

新增flying-enemy.mjs纯展示helper，无World写入/额外RNG；普通死亡根据perython_death43..60共18帧/.6s，source script_utils.y_enemy_death2523–2654只读字节码（vanilla共享2579起）在动画完成后隐藏所有sprite。body/shadow在动画期间保留原alpha1，结束隐藏，不再错误1.2秒淡出；World本身尸体数组保留/移除时序未改。特殊伤害hide_during_death/分解FX缺少完整World伤害类型，本批不伪造；一般单位healthbar仍原现有primitive，未称所有敌状态/视觉完成。原选择rect(-15,50,30,25)、live infobar与地面marker/泄漏清理沿既有语义。

308Node通过，新增原图面留白/锚点/阴影尺寸/排序/flip/alpha/不变性与18帧隐藏边界。最终实际build专项比较原WebP与部署crop RGBA、实际Canvas body/shadow drawImage的q/trim/同world原点/缩放/镜像/alpha，真实body位置鼠标及手机CDP选择、wheel、普通死亡末帧/隐藏/漏怪、原tower3通知与暂停、重入均正常exit0。spawn/death/冻结时钟为受控显示fixture，非天然通关或原版同步。初专项误用不存在routeFor，改实际routes[road][lane]；暂停World会被真实active门拒选，改先真实选择再冻结采样；矩阵getTransform实测418.0609130859375对理论418.0609080806728为float32量化，断言按两float32 ULP而非不现实1e-6，未改产品坐标或图像。所有早期失败结果均收集。

桌面perython-original-shadow.png/mobile.png已人工查看，当前取样非原版同步。最终天然新存档九模式三战役三星/存档手机正常exit0，3campaign自然XP4705/20生命，World/策略/HP/gold/XP/cooldown未动。原enemy-infobar/render-order/UI与公开0.2.87完整UI通过。冷路径100ms/1.5MBps/cacheoff14,170,602B/15.264s<15MB，无新图下载/未调预算/降质，不是所有线上线路速度保证。logs flying-tests.log/build.log/browser-pixels-final.log/selection.log/order.log/campaign.log/ui.log/performance.log/pages-ui.log。


## 0.2.93 普通弹道端点显隐与火把方向

只读核对APK scripts.arrow.insert/update（1947–2130）与bomb.insert/update（2138–2155/2157–2299）字节码，以及vanilla-common-scripts.lua2081–2162/2308–2368。首sprite插入时hidden；更新按当前位置到from/to的world距离严格小于hide_radius隐藏，等于半径可见，不影响其他sprite。现arrow1/2半径6、hero箭1、rock1/2半径8、torch6由真实模板读取，不套textureScale或屏幕尺寸。

火把遵守arrow.insert方向：to.x>from.x则rotation_speed取负，否则正；正速翻转flip_x，原sprite.r加elapsed×signed speed。纯展示不写World字段或消耗World RNG。炮石原随机初角/旋转、普通箭原逐帧速度朝向、原完整抛物线/粒子显隐仍未做，不借本批声称完整弹道。World伤害、命中时刻、目标、数组、金币、HP、XP、冷却均保持。

323项Node全过；实际build test:projectile-visibility通过原Renderer/Canvas捕捉arrow/hero/rock1/2/torch在from/to半径内/等于边界/中段的显隐与火把实际rotation/flip，World快照不变，真实mage购买/开火、缩放、暂停、手机CDP触摸、场景重入均过。额外弹体与重叠为受控展示fixture，非原版同步。旧torches专项最初没有等door/关闭首关教程，World.paused=true/time0导致根本未发射；诊断后等待原scene门并复用真实dismissOpeningTutorial按钮，不跳过产品教程/不改World门控，最终火把/命中/燃烧专项正常exit0。

最终build UI、完整天然新存档九模式三战役三星/存档手机正常exit0，三campaign天然XP4705/20生命；公开一次manifest确认0.2.92且完整UI过。冷路径100ms/1.5MBps/cacheoff真实book->battle14,182,234B/15.488s、201请求<15MB，无整atlas/OTF，不是线上所有设备保证。logs projectile-visibility-tests-final.log/build-final.log/browser-final.log/torches-source-final.log/ui.log/campaign.log/performance.log/pages-ui.log。桌面/手机受控截图已看，不称像素验收。


## 0.2.94 原购买/卖塔烟尘与延迟、层级

完整只读原systems.tower_upgrade APK633–802与vanilla633–805：初次进入build_animation不生成buy dust，完成替换为真实塔且无hide_dust时，fx_tower_buy_dust位置pos+(0,10)；卖塔fx_tower_sell_dust位置+(0,35)。两声明均中心anchor(.5,.5)、alpha255、z3300、timed.runs1、动画12帧/30fps。旧Renderer把build立即画且anchor(.5,.75)、sell错误请求tower_sell动画，均在actor后硬画，已替换为原逐sprite pose同RenderQueue。extract_tower_effects.py仅读声明与systems -bl审计，输出tower-effect-data.mjs并接完整提取；动画帧已在原go_decals/塔资源，optimizer无损裁图检查保留全部帧。

TowerEffects独立展示缓存观察原World.effects，初次购买延迟到现有slot.buildUntil，跨过World旧.7秒事件移除仍显示至原12帧结束；普通升级立即，pending塔被出售/重新建造则取消，已发烟尘独立，reset/owner/loadLevel/transition清理。World HP/金币/退款/XP/RNG/数组/建造时间均未改。原scripts.tower_build严格elapsed>duration才替换，当前World完成条件仍沿用，原协程量化时刻/掉帧完整轨迹未恢复；需先观察到World内原事件，不冒称原同步帧。建造条scale tween、金币特效字/其他FX/range与ray同z tie仍未全闭合。

326Node通过。最终实际build烟尘专项真实买70/升110/售180全退，采样购买完成延迟/World事件过期后仍有烟尘/源frame1与7/alpha1/原q和trim/dest/位置矩阵/3300晚于3100前景，World快照不变，缩放、手机CDP暂停、重入清理通过。额外受控显示时钟非原版同步或天然通关。首专项误用绝对.801而实际buildAt非0，改按实际record.start；初始记录检查加真实交易完成等待；旧金币断言硬写350起始，但第三关真实400，改读真实初始金与净支出，不改产品数值。旧失败结果均收集。

最终UI/原tower-preview/天然新存档完整九模式三战役三星/存档手机正常exit0，三campaign自然XP4705/20生命。公开一次manifest0.2.93且完整UI过，新版推送不轮询。冷路径100ms/1.5MBps/cacheoff真实书页入关14,229,609B/15.516s、203请求<15MB，无整atlas/OTF/降质/抬预算，非所有线上线路速度保证。logs tower-dust-tests-final.log/build-final.log/browser-release.log/preview.log/campaign.log/ui.log/performance.log/pages-ui.log。


## 0.2.95 原建造条向量缩放与普通击杀反馈

完整只读核对systems.tween APK1288–1386（shared1320起）和render_utils.frame_draw_params31–52。四基础tower_build模板第4sprite buildbar/anchor0,.5/offset-21,50/z3000，scale keys0:(0,1)→.8:(1,1)，默认线性插值。新construction-bar.mjs从本局模板派生原pose，在同actor队列的原World/k/textureScale/camera链执行独立x/y缩放，完整54×8图、原trim和alpha255保留。去掉旧54屏幕宽clip/16屏幕高/y-8，不能把原图面像素当World或phone UI像素。纯展示不改建造时间/金币/World数组或RNG，现World完成条件与原协程严格>duration的tick量化差异仍保留。

追踪原systems.health939–1104奖励与game_gui got-enemy-gold1081–1102：普通死亡增加player_gold并emit该信号；GUI只在hand_of_midas_factor存在且奖励>0时处理额外金钱/音效/glow/WaveRewardFx，普通击杀无当前原型黄色+gold浮字。移除Renderer此处自创20px字/黑描边/.8秒上移淡出，保留World原coin事件、真实gold/伤害/XP/RNG和既有早波WaveReward；不伪造尚未实现的Hand of Midas能力或coin_jump/shower特殊图。现有普通击杀音效等其余状态不借本批宣称已恢复。

extract_construction_feedback.py只读原template与systems/game_gui/render_utils/scripts字节码，记录SHA/选中原sprite/tween到tools/sources/construction-feedback.json，并接完整extract_campaign。首审计误用all/game_gui.lua路径，实际为all-phone/game_gui.lua，已纠正，没执行控制器。

328项Node通过；实际build test:construction-feedback验证四种真实购买/出售全退款、0/25/50/75%完整54×8图与q/trim/dest/独立轴矩阵/alpha、无clip、实际World.hurt普通击杀金币增加但不绘制prototype coin.text，World绘制快照不变，zoom/手机CDP暂停/重入清理均正常exit0。原test:tower-effects共享队列回归正常exit0。初截图包含原菜单关闭中途，最终仅加等真实menu.hidden后再拍，未改产品时序。桌面/手机半程建造截图已看，受控World显示时刻并非原版同步或天然通关证据。

最终build1474文件61,354,576B。UI/完整天然新存档九模式三战役三星/存档手机正常exit0，3campaign自然XP4705/20生命，策略/World数值未变。公开一次manifest0.2.94且完整UI通过，新推送后不轮询。100ms/1.5MBps/cacheoff真实书页入关14,230,939B/14.583s、204请求<15MB，无整atlas/OTF、不降质/抬预算，非所有线上线路速度保证。logs construction-tests.log/build.log/browser-final.log/dust-regression.log/campaign.log/ui.log/performance.log/pages-ui.log。


## 0.2.96 炮石初始角与方向旋转

完整只读核对原scripts.bomb.insert APK2138–2155/update2157–2299与共享vanilla-common-scripts.lua2308–2368：rotation_speed存在时初始sprite.r=(math.random()-.5)*pi，然后按to.x>from.x取负speed，否则正，更新每tick累加speed*dt。当前rock1/2原speed10.471975511966，body原anchor/trim/alpha/z不变。新ProjectileMotion以每个shot对象的WeakMap保存一次UI random angle与发射方向speed，再从elapsed派生r，既不每RAF重抽也不随未来tx跨边反向；owner新弹体自然独立，loadLevel/transition reset清旧选择。只对当前type artillery且有rotation_speed/无align_with_trajectory的分支生效，torch原单独规则不改。

独立可注入UI RNG不消费World.seed/serial或修改shot/template，不能声称Love同seed随机轨迹；初次观测的发射方向与elapsed来自现有World，完整原parabola/force_motion/目标预测/每tick位置尚未恢复。普通箭仍chord朝向，缺原模拟last_pos时不把渲染帧间secant伪装成原速度。本批无新图/World伤害、命中时间、HP/gold/XP/cooldown/寻路或数组改动。sourceSHA/规则与未完边界记tools/sources/projectile-render.json。

331Node通过：两级/左右与竖直方向/随机边界/一次选择/重画稳定/延迟和done不抽样/隐藏初始取一次/重置与新弹体/retarget不反向/非炮石不取随机，World/template快照不变。首纯fixture的frame stub返回空字串导致torch空pose，与新旋转无关，改为真实保留动画名的stub后全过。

最终实际build test:cannon-spin通过真实125购买/建造与reload完成后World.updateTowers合法开火，再用受控第二级左飞弹体/elapsed/位置对照；捕获两方向原angle+speed*elapsed、同帧Canvas矩阵重复稳定、q/trim/纹理scale/alpha/World快照不变，zoom/手机CDP暂停/场景旧WeakMap清理均正常exit0。受控额外炮石与独立UI RNG不作天然通关或原版同步证据。source-cannon-spin.png/mobile.png已人工看。

最终UI/原projectile-visibility/完整天然新存档九模式三战役三星/存档手机与公开旧0.2.95UI全正常exit0，3campaign自然XP4705/20生命、策略/World数值不改。最终build1474文件61,355,779B，冷路径100ms/1.5MBps/cacheoff真实book->battle14,232,142B/15.489s、204请求<15MB，无整atlas/OTF/降质/抬预算，不是线上所有线路保证。logs cannon-spin-tests-final.log/build.log/browser.log/visibility.log/campaign.log/ui.log/performance.log/pages-ui.log。

## 0.2.97 desktop 顶部统计/暂停与人类朝向反馈复核

桌面战斗顶部独立采用原 game_gui 的1024×768参考、fullhd图面768/1080纹理比例及父组.9，而非地图1920raw、phone.5或World比例。原top_left与pause_base/按钮normal/hover共4帧由固定PNG/DDS按原trim还原完整图面，逐RGBA无损检查；源SHA/原KR3标签与共享构造交叉范围登记tools/sources/desktop-battle-top.json，extract_desktop_battle_top.py接全提取与实际build。counters pos0,-22，pause parent右上anchor宽度/pos(sw,-21)，按钮parent内中心/25；实际统计沿用World真值，中文hud采用原desktop Noto Bold*1.4与物理字号取整/fit。隐藏/恢复为原1秒outquad，通知/暂停/教程原门控不变。英雄、技能、通知与暂停内部仍保留既有phone分支，不能称全desktop HUD已恢复。

DesktopBattleTop只管理DOM/展示时钟；transition清理并恢复既有canvas/handler，资源等待纳入原scene事务/owner取消。不改World/RNG/HP/gold/XP/cooldown。最初pause_base在button后覆盖图标，已改底板插在按钮前；最终专项检查实际按钮截图黄色双竖线，手机降采样采区域内部亮像素而非单点边缘，原源图不改。333Node全过，最终实际build桌面/手机几何/真实pause/通知1秒hide-restore/重入、UI/天然完整九模式三战役三星存档手机正常exit0。无指定视频同步battle帧，非像素认证。

人类再次指出倒走/无菜单动画后优先重查：旧版反向镜像已在0.2.4修正，本批没有虚构一个新的方向修复。原侧身帧实际朝右，当前向左才镜像；原路径9模式8370次Renderer帧/flip采样通过。旧directions浏览器入口缺lazy槽等待、hyena动画时钟仍用通用偏移、菜单仍断言旧.6相对值，现改真实点击/原教程按钮/实际hyena时钟与源绝对.6/.88相对缩放；不修改产品规则迁就测试。实际空地圆环0/30/60/90/120ms采样通过，120ms outquad、alpha0->1、关闭/快速重开/系统减少动效兼容。首波通过真实开始/槽/地图/通知入口，记录24个受控模拟时刻的实际出怪GIF，另附菜单当前GIF；不是原版同步或自然通关录像。早期录制误等技能activeNotification（首敌为非模态通知图标）超时，已改等真实敌生成，不跳通知/改门控。

最终冷路径100ms/1.5MBps/cacheoff实际book->battle14,252,585B/5.885秒，总启动入关14.579秒/210请求，低于15MB，非所有线上设备保证。未整大atlas/OTF/提预算/降质。主背景、地图、书页及此前图框通用修复保留。

## 0.2.98 桌面底部英雄与三技能连续分支

完整只读交叉vanilla all-desktop/game_gui.lua HeroPortrait1806–2045、PowerButton2048–2490、HudBottomView3290–3570和KR3对应HeroPortrait2195+/PowerButton2443+/HudBottomView4156+。GUI仍1024×768、原fullhd图面768/1080，底栏无top的.9父缩放：sh先+1；hero hit102×101/anchor0,101/pos15,0在底部；powers父105,sh/anchor0,36，三button29,30/92,30/155,30，原88×88图面缩为62.577…GUI单位。恢复base_gui_kr3_tile、base_powers_bg、原数字1/2/3和方形powers原图，不再phone三大圆/侧边大头像。当前仅Eridan单英雄；不加假第二英雄或背包能力。

web/desktop-battle-bottom.mjs独立只读World。英雄原portrait+frame/hover/selected、level TOONISH14、health22,78与XP22,84按原图scaleX比例、63×63黑色150alpha死亡覆盖由78向上绘制；原disabled默认150、frame200乘色，源KView.disable/apply_disabled_tint交叉。真实等级变更/复活触发heroPortrait2–29；UI时钟独立World，字体基线/Shader仍Canvas近似。技能原icons17/18/hero ultimate_icon1与mask45帧，locked30/unlock30–44/selected29/hover45/ready1–28后post1；ceil(ts*30)边界，普通态/冷却mask1。原冷却为黑色150alpha、GUI inset9,10/size(button-18,-19)的纵向矩形，不是phone径向遮罩；进度读当前实际cooldown和本局模板duration，提前波次减冷却继续有效。暂停冻结真实cd，动画使用展示UI时钟；ready音效每次转入只发一次。没改World/HP/伤害/XP/gold/RNG/冷却/命中/寻路。

整个底栏按原HudBottomView.hide/show 1秒outquad下移110GUI，hero随父底栏，不继续phone左滑；旧HudMotion只移除已迁移hero/powers组，notices仍legacy。DesktopBattleTop公开geometry.hero/powers改为实际desktop结果，避免外部仍读取旧phone几何；Campaign保持原输入/施法/解锁/通知/教程/场景事务，draw时选择desktop底栏或显式phone旧BattlePortraits。owner新World弱缓存，destroy恢复旧handler/删除base与profile，不跨槽复活。尚未迁移原底部next-wave按钮、infobar/教程气泡/通知面板/暂停内部与其他desktop细节，不能称整个battle HUD已完。

extract_desktop_battle_bottom.py只读取固定声明与原PNG/DDS，tools/sources/desktop-battle-bottom.json记原controller/atlas/sheetsSHA与选择规则，86帧按q/size/trim紧凑无损345,228B，逐全部裁图RGBA验证，接完整extract/build。不加载整3.3MBGUI或3.7MBportrait原PNG到浏览器，未降质或提高15MB。

336Node全过，新增geometry/ceil与ready post/state转移3项。实际build专项验证桌面/手机原几何、hero portrait/frame/selected实际Canvas q与healthbar位置/比例/trim、draw前后World快照不变、真实按钮开波/施法与纵向冷却/暂停、原World.hurtDefender受伤死亡与实际step复活/portrait反馈、受控1秒下移、手机CDP选择及原showMap门清理。截图desktop-battle-bottom.png/mobile.png/dead.png已人工查看，死亡伤害和UI时钟为受控样本，非原版同步像素证据。

专项早期fixture错误如实：准备期status ready的技能本就disabled，改先真实双击开波再点，不force/改产品门控；施法后mask需下一RAF才更新，改等真实data-source-mode；Canvas.fillStyle将150/255序列化为两位小数，颜色字符串断言按.005序列化精度校验，不改产品RGBA或像素容差；纯geometry两种浮点运算序相差1e-14，按1e-12数值精度验证。首次公开UI打印通过但Node92437残留、首次campaign九模式断言完成后Node92548残留，daemon PID比对后精确TERM收143，不冒称这两次exit0；finally改先context.close再browser.close后独立回归正常退出，结果分别保留。无临时诊断产品代码。

最终发布构建1483文件61,739,872B。最后一轮build→desktop-bottom专项→独立天然完整九模式/存档手机→本地UI→冷路径性能串行均正常exit0；336Node通过。顶栏与原实际powers施法/取消/暂停/手机/教程恢复回归也过。最后修正selected取消但指针仍在按钮上时直接highlighted，不多闪一帧default，纯测锁定该源分支。公开一次build-manifest确认0.2.97，旧版UI断言通过但第一次关闭残留后TERM143，不冒称完整exit0；新推送后不循环等CI。冷路径100ms/1.5MBps/cacheoff真实book->battle14,615,153B/7.150秒，总启动入关15.921秒/213请求<15MB；保留原预算/图质，无整atlas/OTF，非所有线上速度保证。logs bottom-tests-final-release.log、bottom-build-publish.log、bottom-browser-publish.log、bottom-campaign-publish.log、bottom-ui-publish.log、bottom-performance-publish.log、bottom-top-regression.log、bottom-powers-release.log；早期失败与残留记录保留，不提交artifacts。


### 0.2.99 desktop tutorial balloons and reference check

DesktopGuidance migrates TB_BUILD, TB_POWER1/2/3 and TB_ROAD to original fixed images and GUI1024x768 / 768:1080 scale. Source TutorialBalloon5898–6165 and KR3 data supply anchors, label rectangles, offsets221/287/353,-104, original localized text, initial inherited alpha1, .3-second in-out-sine growth/pulse and .4-second in-back removal. BUILD follows projected World position, menu hide/restore and actual purchase; two real reinforcement/thunder notification chains select powers and create ROAD immediately. Third-power view is covered with an explicit fixture because existing TIP_HEROES emits no TB_POWER3 signal; no fake production trigger added. START/WAVE/NOTI and pause/notification interiors remain legacy.

Actual specified BV1y8411R7iB P8/CID1232855803 reference65/90 seconds shows third-level preparation with closed power doors;125 seconds shows wave1 with open powers. Pure presentation now keeps already-disabled ready-state powers visually locked. Existing World legality, HP/gold/XP/RNG/cooldowns remain unchanged. This is same-level visual evidence, not synchronized same-input pixel certification.

Three selected images exported as original RGBA PNG (4142B total), fixed source hashes and declarations in tools/sources/desktop-guidance.json. Pillow crops match all channels. WebP browser partial-alpha readback initially differed despite file RGBA equality; PNG and stable CPU Canvas readback (willReadFrequently) give zero differing channels for all three original crops. Default mixed GPU/CPU readbacks also produced small RGB differences; no relaxed pixel comparison used. Font baseline/shader remains approximate.

339 Node tests pass. Actual final build1488files61,753,980B passes native guidance geometry/phase/pixel/mobile/camera/pause/cleanup, natural fresh-save nine modes and persistence/mobile, UI, desktop-bottom regression. Public .98 UI passes after fixture waits for actual settings-close transaction before Start; no product gate weakened. Native third-power fixture, controlled display clocks and screenshots are not natural progression or original synchronized evidence. Cold100ms/1.5MBps/cacheoff actual book-to-battle14,628,163B,7.168s, total15.953s/217requests; budget15MB unchanged, not a universal network guarantee. Logs guidance-tests-final/browser-publish/campaign-publish/ui-publish/bottom-regression/performance-publish/pages-ui-final.

Human preference: publish every release to GitHub Pages and present that URL first; same owner-private Site remains synchronized.


### 0.2.100 第4–6关还原工作区

按最新人类指示将主工作重心转向后面三关，前三关余项继续保留记录。已从原APK逐项提取红杉阻击战/皇家庭院/狮鹫驿站的九份模式数据、原路径/建造点/预建建筑/金币/波次/模式限制，38个额外依赖模板、三张背景与3566个所选帧键。extract_expansion.py/source expansion.json固定原声明与图面SHA，不执行控制器；完整图片与每个紧凑sprite crop逐解码RGBA无损验证，保留size/trim/alias。初轮输出的整stage中间图已清除，仅紧凑包保留。

ExpansionRepository隔离目录，不修改旧catalog/save/解锁；生产仍前三关九模式，新关暂未开放，绝不把缺失特殊机制的普通敌人替身冒充完成。实际build资源预览通过三关背景/初始引用sprite无缺帧、World/旧进度不变、桌面/手机；这些是资源预览，不是新九模式通关或原控制器演出。新关机制缺口详见STAGES-4-6.md：ettin regen/狂暴、blighter ranged/封花、载兵飞行释放、harasser、ewok、gryphon/关卡脚本、高级塔等。

343Node全过。首UI命令忘显式TEST_URL使用默认8765，连接拒绝正常exit1；改命令指向实际build8766，未修改产品/测试门控。后续原九模式/UI/性能日志分别独立收集。源包是尚未启用的按需资源，不代表新关入关预算已验；旧关键路径保持15MB。


最终actualbuild1503files72,763,398B，343Node、新三关资源预览与原天然完整九模式/存档手机/UI均正常exit0。冷路径100ms/1.5MBps/cacheoff14,637,653B，book入关7.149s、总15.924s/218requests，无整atlas/OTF；新扩展包未进入当前旧关加载链，不称新关预算。104个固定源SHA独立复核通过。截图expansion-stage4/5/6-resource-preview和stage6-mobile-preview已人工看，均资源预览不是特殊脚本/战斗验收。


### 0.2.101 第4关双头食人魔基础行为

只读核对原APK game_scripts8777–8841、scripts3963–3995与templates定义；缓存kro-kr3-game-scripts.lua9700+仅交叉阅读，不执行控制器或移植mod逻辑。原aura every5/30秒回4HP、无受伤standoff、ignore_stun=true/ignore_freeze=false，APK被freeze/mod-ban拒绝时重置aura.ts（共享vanilla源码分支不同，因此以APK字节码为准），正常每模拟tick最多一次脉冲，满血也推进时钟。

原insane不是攻速/伤害增益：插入时一次整数random12..22秒，此后沿用同cooldown、每次start重置ts；严格超过cooldown且无shield、离开已有近战阻挡episode后启动。insaneStart109–142，28/30秒自伤random5..10/type1，clamp到hp-1保证不自杀；原start动画结束后insaneLoop143–162循环，停顿2秒再恢复idle/walk/近战。前摇hit_time等待可被stun打断，hit后动画等待不可打断，loop等待再按stun/death中断。仅新ettin分支消费原有World.number，不使用UI随机替代战斗随机，不宣称Love同seed轨迹；旧五敌无新增RNG调用。原特殊血池/分解/完整外部modifier生产链仍未全。

原生命代价数组按本局difficulty取标量，普通难度ettin漏2命、第四源数据4命，防原新模板数组导致NaN；第四难度UI仍disabled。普通ettin death163–186/alpha1末帧至严格>2秒，复用GroundCorpses纯展示缓存，World旧1.2秒数组清理不改。新三关仍在隔离工作区，不能称第4关全玩法或18模式完成。

新扩展提取开启可选17位IEEE754往返编码，修复旧Lua tostring将5/30变成.16666666666667导致边界晚一帧；对应hit_time同样保留原精度。原提取默认不改，重新读取全模板与上轮旧输出逐对象一致。精度重提三背景/3566framekeys逐RGBA仍通过，图面文件未变。tools/extract_ettin.py仅读-bl记录原4个文件SHA与源范围，完整提取链已接。

350Node全部通过。源边界覆盖regen精确5/30、最近受伤/stun无延迟、freeze/mod-ban时间重置、目标override、单tick脉冲、death/leak不复活；self-hit严格cooldown/非致死/阻挡/打断/loop恢复/近战取消；life-cost与普通尸体清理。初纯测任意非零时间原点直接加34/30后相减落在边界前，改取一个真实帧后采样而不改产品阈值。浏览器初fixture把World含spells.world循环引用直接JSON.stringify失败，改记录明确模拟字段；后续forced anim0断言还按anim选期望帧，改源phase期望，产品phase绘制实际正确。

实际build test:ettin在隔离第4关World调用真实spawn/hurt/step/RenderQueue，记录原Canvas q/alpha、移动/近战停止、真实回血/非致命自伤/暂停时钟/普通death末帧和2秒清理、zoom/mobile与清理；受控位置/模拟时间不是自然关卡通关或原版同步。最初截图位置落在原树前景遮挡下，改用真实route点(303,265)并同步d，最终ettin-self-stun.png/mobile已看见角色；手机缩放预览的整关前景边界仍需后续完整关卡层级核对，不拿局部精灵调用当全关像素验收。旧普通九模式/UI和公开.100UI结果独立保存；完整全关尚未开放。


最终build1504files72,767,122B；350Node、ettin-browser-release-final及额外可见位置复测ettin-browser-visible、天然完整九模式/存档手机ettin-campaign-release、ettin-ui-release、公开.100 ettin-pages-ui均正常exit0。冷路径100ms/1.5MBps/cacheoff14,641,065B、book入关7.066s、总15.912s/219requests<15MB，不保证所有线上线路速度；新关启用预算尚未验，不抬预算/降质。无新图关键下载，完整old-template默认导出比对通过。


### 0.2.102 第4关载兵鹿角鹰连续分支

原APK game_scripts8845–8897及其8850/8858闭包、script_utils237–274与y_enemy_death2523–2654、path_db.next_entity_node只读审计；共享vanilla路径源码与kro carrier文本仅交叉，不执行控制器或移植mod数值。tools/read_carrier_rules.lua只读原constants，extract_carrier.py写原damage/flying/modifier常量与5个SHA、范围限制，完整extract_campaign已接。初source audit只选主函数片段未含spawn_trigger_range闭包字段而失败，已扩大到carrier全部闭包+主函数，不改产品绕过。

靠近地面活士兵/hero的原100椭圆范围可主动释放，死亡不是唯一触发；普通stun也释放，TELEPORT/TIMELAPSE适配输入排除。默认drop_delay不存在，因此不新增随机；若定义范围才按原frandom职责从World随机取一次。释放实例carryingfalse/quantity0，下一tick藏第三sprite，不写template；死亡不重复生成。普通死亡18帧/.6秒后释放，保留末帧alpha1一个yield再hide_after_death；eat/no-spawns抑制子单位，disintegrate处理即刻隐藏/释放职责但特效图面尚未完整恢复。非致死damage type本tick累积，源modifier生产链仍未完整。

子单位源pos为母体位置clone、同road/lane、原nav.ni+2，next_entity_node目标为再前一节点。carrier在现距离模型内跟踪原节点近距阈值，每tick最多前进一个索引，未改旧路径物理。payloadJoin从实际源位置以原33速度走向前方目标，不能直接onRoute把身体瞬移到node+2；无效末端目标按原insert失败语义拒绝，不夹到终点。当前4–6 carrier路径均无connections，这一分支尚未泛化跨连接路径/native协程与insertID全流。queued子单位与待普通死亡落兵阻止过早胜利；只改新增carrier分支，旧enemies数组次序/金币/HP/XP/RNG/射程/冷却/路径不改。子单位使用原gnawer战斗与aura，不虚构独立落地动画（原当前death_spawns没有spawn_animation）。

三sprite分别是原perython body、static flying shadow、gnawer_flying第三层；每层独立prefix/anchor/trim/alpha/flip/z/draw_order，经原World textureScale*k/camera。原third death映射gnawer111–128、正常flying129–170按方向；shadow不随bodyflip。enemyDirection原代码移动到纯模块后由Renderer re-export，旧方向API/算法不变；carrier在model更新源方向，不由绘制反写。旧perython两层/body hide时序保持。

358Node全部通过。实际build test:carrier验证三层原Canvas q/原anchor/比例/alpha与选择rect、真实World.spawn/addSoldier/step/hurt触发主动释放、暂停冻结插入队列、复制位置且每tick移动不超过原速、下一tick第三层消失、普通死亡边界/子单位数、zoom/mobile与新场景清理、draw前后模拟/进度快照不变；这些是隔离4关受控位置/时间样本，不是自然第4关通关/原版同输入像素认证。carrier-three-sprites.png/payload-released.png/payload-mobile.png已人工看见角色。

最终build1508files72,773,465B，载兵专项、ettin与原perython真实选中/暂停/通知/mobile回归、天然完整旧九模式/存档手机、UI、公开.101UI均正常exit0。三个campaign20生命，第三campaign入关自然XP4705，末总XP继续自然累加。logs carrier-source-final/tests-final/build/browser/ettin-regression/flying-regression/campaign/ui/performance/pages-ui。冷100ms/1.5MBps/cacheoff14,646,834B，book入关7.151s/总16.069s/223requests<15MB，没有新图片关键下载/整atlas/OTF，不保证所有线上线路速度；新关自身资源预算未验。第4–6仍未开放，blighter/ewok/高级塔/关卡事件等仍待接入，不把本批局部机制称为完整18模式。

### 0.2.103 第4关枯萎者封花连续分支（能量弹未完成）

只读核对原APK game_scripts8647–8723及ready闭包、mod15685–15717、plant13039–13136，以及systems.mod_lifecycle。extract_blight.py固定三源SHA与选中模板，接完整提取，不执行控制器。原5秒检查/175椭圆，优先第一个未blocked植物；.5秒前摇可被stun中断，提交后等待attackPlants结束再行动，期间不另起近战。禁用目标绑定World植物对象，不把plant局部数字id误作敌人id；4.9秒mod独立于来源死亡。sys.mod_lifecycle拒绝同级重复、只重置modifier.ts，原U.y_wait与无resets_same_tween的alpha不重启。完整原协程插入tick量化未恢复。

原mod贴图与alpha keys0:0/.3:255/4.6:255/4.9:0进actor队列，World.activatePlant拒绝blocked而不消耗金币/额外冷却；结束按源plant分支重新开始原custom_attack.cooldown蓄能。现有植物完整loading/ready及独立FX通知循环尚未恢复，未把这批局部机制称全关完成。远程仍待原energy动画/hold_advance与独立追踪加速弹，不能误用旧launchTorch/火DOT；本批明确未称远程完成，第4–6生产入口继续关闭。

362Node通过；实际最终build test:blight覆盖真实World.step封花、原Canvas q/alpha与draw只读、死亡后持续/解除重蓄能、暂停/zoom/mobile/owner清理。受控位置/时钟样本不是自然新关通关或原版同步。桌面/手机截图已人工看，手机整关前景接缝仍待完整层级验收，不拿局部modifier调用证明整图像素一致。新mod字面量让旧塔紧凑包完整增加12帧，1314帧/2,122,316B，逐原RGBA/trim验证；没有提高15MB或降图质。

最终build1509files72,827,505B；blight-browser-final、天然完整旧九模式/存档手机blight-campaign-final、blight-ui-final与公开旧.101 blight-pages-ui全部正常exit0。冷100ms/1.5MBps/cacheoff14,700,669B，book入关7.082s/总15.958s/224requests<15MB，无整atlas/OTF，不保证所有线上线路；新关自身预算尚未验。所有三个campaign20生命，第三campaign入关自然XP4705，完整九模式末自然XP继续增长。

### 0.2.104 枯萎者专用远程能量弹

原APK game_scripts14118–14159与script_utils2784–2832/367–387、scripts494–559、utils245–313完整只读-bl交叉缓存源码。extract_blighter_energy.py/read_blighter_energy.lua读取原FPS30/F_RANGED2、固定六源SHA并接全量提取，不执行控制器。源enemy_basic.insert把ranged.ts设出生时钟，非全局0；新的held ranged episode按hold_advance在冷却时也停步，energy前摇20/30秒、原动画30帧，cast开始一次chance draw，释放原offset14,0随水平flip。释放初始to包含hit_offset，专用update随后追踪target.pos中心。目标在前摇中死亡并不自动取消释放，原释放仅查vis flags/bans；死亡目标弹仍飞完而不伤害，未自行加一个health门。

弹体mspeed60起，每模拟tick先以旧to/旧speed测试distance>speed*dt，再追踪/检查目标死亡或F_RANGED ban；speed+=FPS*ceil(speed/FPS*acceleration_factor)，clamp60..240，以规范方向推进实际位置。没有用旧sin弧线、固定duration、火把spin或burn。travel按原三方向/10度stickiness和每tick animation_start重置ts，因此当前正常模拟绘制多数是对应travel首帧，不为视觉“顺滑”改变源时钟。抵达时原create_bullet_damage是ceil(frandom50,75)/type2；APK该helper没有共享vanilla后来新增的damage_factor分支，当前sourcefactor1不受影响。复用现hurtDefender的物理护甲/取整适配，原damage queue/native调度完整同输入尚未恢复。

原hit阶段是在同弹体pos=(to.x,to.y-1)播hitUpDown24–26三帧，再删除；虽然bullet声明hit_fx，专用controller没有生成它，未虚构generic hitFX/火把DOT。目标死亡/禁止ranged时永久丢失追踪，仍飞到末目标点；移出World不向无效对象提交伤害。弹体及phase归World，暂停不推进，场景丢弃World清理；绘制只读pose进入同actorqueue原z3000/anchor(.5,.15625)/trim/alpha/world纹理与相机链。旧burner保持原launchTorch，不加新RNG调用。

纯测覆盖实际出生冷却、源range/ban边界、hold、前摇与打断、左右offset、逐tick加速/中心追踪、animation ts重置、死亡/丢失目标、旧to接触边界、一次伤害、三帧hit/无DOT或genericFX、World暂停与旧模板不变。最初源码audit把queue_insert upvalue当成带引号字段而失败，修正为实际UGET注释检查，没执行控制器。完整新关仍缺树屋/高级塔/关卡事件/资源分组与解锁，不能据此称新九模式可玩。

最终373Node、actualbuild test:blighter-energy/封花与旧火把回归均正常exit0。原完整九模式首轮完成全部战斗/存档/手机断言并写出passed JSON后，在浏览器关闭阶段挂住；与daemon88207比对后只TERM Node10284，收143，明确不算正常通过。未改产品/策略/门控，独立串行重跑energy-campaign-repeat → energy-ui → energy-performance全部正常exit0，三个campaign20生命，第三campaign入关自然XP4705，末XP继续自然增长。公开一次manifest确认.103，首UI启动30秒超时，独立energy-pages-ui-repeat完整断言和最终exit0，不改超时值。无未收集失败结果或后台。

最终build1511files72,835,167B；冷100ms/1.5MBps/cacheoff14,708,023B，book入关7.169s/总16.092s/226requests<15MB，无整atlas/OTF，不保证所有线上设备/线路速度。无新图下载，旧塔compact1314帧/2,122,316B保持；新关自身资源预算未验。blighter-energy-flight/mobile/hit已人工看，飞行桌面样本附评论，均隔离受控展示不是新关天然通关/原版同步证据；手机整关前景接缝仍待关卡层级验收，不掩盖。logs energy-tests-final-release/build-publish/browser/blight-regression/torch-regression/campaign-repeat/ui/performance/pages-ui-repeat。

### 0.2.105 树屋修复与付费佣兵连续流程（盾挡待接）

原APK模板将tower_ewok指向tower_barrack_mercenaries.update，非普通兵营自动fill；source菜单holder_ewok只tw_upgrade/tower_ewok，修复后ewok菜单tw_buy_soldier/soldier_ewok+tw_rally。tower.price100是修复费，每名unit.price100另付、容量4，绝不是100送四名。只读scripts1864–1939、game_scripts17402–17482、utils1010–1023、systems升级/扣费链与原game_gui交易字段，extract_ewok_hut.py/source JSON记录六源SHA/原菜单/所选模板及肖像来源。混合社区soldier_ewok文本新增y_soldier_revive并注释原death，已以APK普通death直接return为准，未移植mod复活。

World追加独立ewok slot、不改变旧建造点序号或四TYPES。repair100即时替原holder、不出免费兵；hire在原door open动画完成后才扣100并生成一名原soldier_ewok，等待期间重复请求不另计费，door hold .5后关闭。原同位置/respawn_offset、默认rally、单人站中心/多人按实际当前数量分布r25/.7椭圆；死亡对象保留到strict>3秒清理才释放容量、幸存者重新排阵，不免费复活、不允许出售修复树屋。新单位复用当前战斗适配原HP100/speed75/近战3–7/hit10帧与spear16–20/shoot11帧/flight22帧；idle regen仅满足2秒standoff时累计dt严格>.5脉冲+15。原盾挡控制器、投矛预测/真实抛物线/特殊death尚未全做，不把普通战斗适配说成完整原小熊。

真实Campaign/TowerMenu/原按钮双击交易专项初次发现Missing original UI sprite portraits_towers_0013导致RAF中断，原请求已提交而World停钟，并非door等待规则错误。只补原肖像，不吞异常/换占位图或放宽门控。extract_ui添加13号并验证完整RGBA；首次WebP lossless默认丢弃alpha0下RGB被严格比较拒绝，新增肖像专用exact=True后逐RGBA一致，旧600图编码未改。新图1780B；另与APK原PNG直接交叉，修正旧runtime atlas在透明RGB上的差异，新图直接从原PNG选取并精确保留。source JSON记录原PNG SHA/运行时atlasSHA/原q-size-trim/浏览器SHA，完整extract链可复现。

381Node已过（8新领域测试），actualbuild hut-browser-fixed通过实际修复/四次真实菜单招募/价格容量、Canvas原士兵q/alpha与draw只读、原pause按钮、手机、死亡不复活、旧地图清理且存档上限仍1。ewok-hut-recruited.png/mobile已人工看；这是隔离第4关受控fixture而非正常新关通关/原版同步。当前实际Campaign手机样本未出现先前独立Canvas的重复前景边缘，但本批未改背景/前景，不据此声称完整新关层级已验。盾挡/完整spear及新关脚本/高级塔/资源预算仍欠，入口继续关闭。

关门边界也按原协程补齐：主动close动画期间来的hire请求先排队，close结束后再open，不能中途倒播/跳过关门；新增纯测验证此时不提前扣费或出兵。最终不改World正常伤害/金币/XP/RNG来迁就测试，只有新树屋分支增加真实消费与新单位。

最终381Node、hut-browser-release真实Campaign菜单/Canvas/76x76原肖像decode、hut-campaign-release完整原九模式/存档手机、hut-ui-release、hut-performance-release及公开.104 hut-pages-ui均正常exit0。三个campaign20生命，第三campaign入关自然XP4705，末九模式XP继续自然累加，未改策略/数值。最终build1513files72,841,949B；冷100ms/1.5MBps/cacheoff14,712,692B，book入关6.272s/总15.221s/227requests<15MB，无整atlas/OTF，不保证所有线上设备速度；新关自身预算未验。最终桌面/手机样本已人工看。此前portrait缺失两次专项30秒失败与默认WebP透明RGB比较失败均保留日志且已明确修正；源码访问凭证打包时过期已更新后成功重做，未打印/落盘token。无失败结果待处理或run-owned后台。

### 0.2.106 小熊半血盾挡与原攻击调用边界

只读核对APK game_templates14032–14035、game_scripts17402–17482、script_utils138–157与enemy melee调用、scripts.arrow1989–2130。新extract_ewok_shield.py固定五源SHA并接完整extract_campaign，read_ewok_shield.lua仅读constants的DAMAGE_NO_DODGE33554432，不执行控制器。关键函数值未进入旧JSON：can_dodge先写last_hit_ts，再返回hp<=hp_max*.5；不是满血举盾或固定四秒全免伤。原helper先检查stun/ranged/严格>20秒冷却/NO_DODGE，再抽chance（即使1），最后半血函数。两段责任保持，不用UI随机替代战斗随机。

新ewok-shield.mjs仅新小熊拥有state；原near-hit dodge_time/time_before_hit0和普通火把arrow命中调用判定，旧兵/英雄路径不新增随机。start前开始duration4，start11帧、hit10帧、end5帧原动画，等待完end才重置cooldown.ts。hold保留最后原动画帧，不伪循环；期间停位/取消自己未释放攻击、保持既有近战阻挡并继续源离散regen，战斗冷却按已逝时间推进。回血超过半血后仍在盾动画也可受伤，函数回调记录hit反应不等于必然成功dodge。stun通过原phase结束职责，普通死亡保持既有永久死亡/三秒清理。完整native协程/queued damage时序、特殊death与modifier生产链仍适配，不称同输入逐帧一致。

没有全局修改hurtDefender：专用枯萎者energy没有unit_dodges调用，已有burn也不因举盾自动停止；普通火把成功dodge才抑制本次伤害与新附burn。投矛依旧是现有friendly arrow适配，原预测/抛物线未做，本批不声称完成整个小熊或第4关。第4–6入口仍隔离未开。

387Node测试全过；6新纯测覆盖半血/strict20/chance顺序/NO_DODGE、四秒与end后冷却、回血后不免伤、stun/死亡、真实melee caller/暂停、torch与已有burn/direct damage分流。实际Campaign/TowerMenu真实100修复+100雇佣后，用受控攻击/World时钟捕start/hold/hit/end四阶段Canvas原q/alpha/无missing与draw前后模拟快照一致，真实pause/zoom/mobile/死亡与map清理。截图ewok-shield-hit/mobile已人工看，是隔离第4关受控测试而非天然新关通关或原版同步。

首专项仅对全部progress做快照比较失败：新增真实敌通知合法更新seen；改只比较真实关卡解锁/星/挑战，不跳教程/通知、不改产品门控。公开一次manifest确认.105；首远程UI断言已完成但Node16593关闭挂住，与daemon88207比对后TERM143，明确不算exit0；独立重跑结果另记。原本地全九模式与UI正常exit0；最终修改仅修shield期间战斗冷却时间继续流逝后，最终包再串行回归，不拿修改前检查冒最终结果。

最终actualbuild1515files72,844,669B；shield-browser-release → shield-campaign-release → shield-ui-release → shield-performance-release串行全部正常exit0，原9模式/存档手机全过，三个campaign20命、第三campaign入关自然XP4705，末XP继续增长。387Node全过，shield-rules-final另对最终纯测试补充的冷却不冻结断言通过；hut招募回归正常exit0。远程公开.105独立shield-pages-ui-repeat最终正常exit0，首关闭挂住143已如实区分。冷100ms/1.5MBps/cacheoff14,715,120B，book入关6.301s/总15.285s/229requests，无整atlas/OTF，15MB不变、不保证线上所有设备速度。没有新图下载；原紧凑塔1314帧仍2,122,316B，新关自身预算未验。

### 0.2.107 小熊专用投矛预测、抛物线与接触

只读完整核对原APK scripts.arrow1947–1987/1989–2130、script_utils389–401抛物线、367–387 damage、1084–1167 soldier ranged发射职责，与缓存共享源码交叉，不执行控制器。tools/extract_ewok_spear.py固定原scripts/script_utils/templates三SHA并接完整extract_campaign，记录选中bullet原模板及剩余边界。

小熊射击不再进入旧friendly arrow的sin/chord追踪适配。新ewok-spear以原发射偏移(0,10)、target.pos+hit_offset+velocity*22/30固定一次预测落点，g=-900，initial_parabola_speed与position_in_parabola原公式更新。原弹体hide_radius6/anchor/trim/alpha/z3400保持在同actorqueue，角度取实际每模拟tick的last_pos差，不按渲染帧重算或用from-to弦线。新插入同tick不推进；source while elapsed+tick<=flight_time后，才用当前仍在World且活体目标+hit_offset严格距离<22判断接触，成功一次ceil(frandom16,20)后复用真实hurt。发射不预抽伤害、死亡/移除/走离目标不假必命中，目标改变位置不拖拽固定终点。ranged前摇记录目标初点，移动超原attack.max_track_distance128取消发射；bullet模板max_track_distance64没有在这个controller中凭印象加追踪。

新关motionVelocity来自World模拟tick实际位置变化/真实dt，旧前三关不增加此字段；不是图集像素、不是路段dx/dy直接当速度，也不是RAF差分。当前World寻路/held动作及更新顺序仍适配原native motion/controller，完整ranged episode目标挑选/随机、queued damage/nativeIDs/协程、未来harasser目标dodge、blood/pop和水面miss FX未在此批声称恢复。原其他塔箭/英雄/炮石/torch分支不改，盾挡与能量弹回归保持；新4–6继续隔离，不据本批弹体方程称完整小熊或18模式完成。

392Node全过，5新纯测覆盖固定预测/原offset/无发射damage RNG、抛物线/模拟切线/z、strict22命中与miss无RNG、死/移除/maxtrack/插入一tick、暂停与新关速度/旧关不加字段。原hut测试改为等待真实contact才有damage，不保留旧发射时预抽的错误预期。actualbuild test:ewok-spear真实Campaign修100/雇100后由World ranged前摇开火，捕实际Canvas原q/alpha/矩阵朝向、抛物线坐标/draw快照不变、moving target固定落点/真实伤HP、pause/zoom/mobile/map清理通过。额外模型位置/时钟为受控fixture，不是自然第4关或原版同步证据。

首截图手动模拟后统计DOM尚未刷新，初取样top400而World真实300；最终截图前调用原updateBattle同步显示，没改交易或假造金钱。ewok-spear-flight/mobile最终已人工看，top300与100+100真实消费一致。没有浏览器产品故障待处理。shield/专用energy回归、完整天然原九模式/存档手机、UI与性能串行exit0。三个campaign20命、第三campaign入关自然XP4705，末XP继续增长。公开一次manifest确认.106且spear-pages-ui正常exit0，新发布后不轮询CI。

最终build1516files72,847,957B；冷100ms/1.5MBps/cacheoff14,718,269B，book6.215s/总15.215s230requests<15MB，无整atlas/OTF/新图下载，原塔compact1314帧2,122,316B保持。不是所有线上设备速度保证，新关自身预算仍未验，扩展7.3MB不能直接整图预载后抬预算/降质。logs spear-tests/build/browser-final/shield-regression/energy-regression/campaign/ui/performance/pages-ui均已收集。

### 0.2.108 第5关暮光骚扰者四连射（后跳待接）

完整仅读APK game_scripts8903–9021/14164–14167、SU2834–2895、scripts.arrow1989–2130与原mod_mark_flags声明/queue/dequeue/update，交叉缓存源码。原模板primary insert=enemy_basic，出生ranged.ts；严格time-ts>10才寻最近合法士兵。先原F_CUSTOM目标mark20/30秒，再shoot_start10帧、四轮shoot_loop5帧/每轮3/30出箭、shoot_end11帧。source loop没有读取repeat_cooldown字段，不能凭声明把四箭额外各等20帧。此专用直接loop调用不走generic ranged chance检查，因此未虚构开局chance1随机draw。start动画等待不提前被stun打断，loop中stun走end，end等待只death中断；模型协程调度仍适配，原同输入边界未认证。

新harasser-data从数据-only模板reader提取mod_twilight_elf_harasser（controller stub），tools/extract_harasser.py/source JSON固定四原文件SHA并接完整extract_campaign。初扩展依赖闭包没包括动态脚本引用的此mod，原声明只有mark_flags/无render，本批不伪造贴图。queue立刻保留/置目标F_CUSTOM bit，源20/30严格过期、目标死亡或移除恢复旧bit，来源死不提前解；保留其他bans。当前只闭合此目标标记，完整通用modifier系统/重复来源调度未冒称完成。

新harasser-arrow每箭insert先U.frandom选.5..26/30 flight，再ordinary arrow原from/to固定目标+hit_offset，predict_target_posfalse。g=-900抛物线/模拟tick last_pos切线、hide_radius6、原arrow图/anchor/trim/alpha/z3400，已有actorqueue共排，不改旧五敌torch/旧塔箭。strict22接触且目标活在本World，ordinary ranged unit_dodges调用边界（当前ewok adapter）成功才一次ceil(frandom20,30)实际物理伤HP，无torchimpact/burn；miss不假必中。已经发出的弹独立于来源；blood/pop/water miss贴花FX仍未全做，不称全部箭状态恢复。

后跳dodge节点/地形门/解除阻挡/隐藏modifier与shadow shot仍未实现，当前新关源路径/native队列/insertID仍适配，不能据此宣称完整骚扰者或第5关可玩。当前生产仍前三关九模式，releaseReadyfalse/存档上限未改。

399Node全过，7新纯测覆盖出生strict10/no额外chance RNG、10/5/11原动画四箭、target mark恢复/来源死亡、第二骚扰者选目标过滤/已提交volley不被新blocker硬打断、stun职责、原随机flight抛物线/伤害无burn、miss/暂停/旧敌无新状态。actualbuild test:harasser从真实World.spawn/step触发四箭，捕Canvas原harraser start/loop/body与arrow q/alpha、绘制前后模拟快照不变、四箭计数/原随机flight/真实hero损血无burn、mark过期、真实pause/zoom/mobile/map清理通过。受控位置与模拟时钟不是自然第5关通关或原版同步像素证据。截图harasser-volley/mobile已人工看，目标hero与预建兵营重叠处为受控fixture，未冒关卡完整层级验收。

初包actualbuild1518files72,852,883B；harasser-browser、spear/shield回归与harasser-campaign→ui→performance串行全部正常exit0，原天然9模式/存档手机全过，三个campaign20命、第三campaign入关自然XP4705，末XP继续增长。公开一次manifest确认.107，harasser-pages-ui正常exit0，新推送不轮询CI。本批无浏览器失败/挂起Node。冷100ms/1.5MBps/cacheoff14,722,915B、book7.167s/总16.209s232requests<15MB，无新图/整atlas/OTF；原塔compact1314帧2,122,316B不变，不保证所有线上线路速度；新关自身预算未验。初source查mod缺失与按错误拼写harasser找不到动画已在实现前核对原prefix=harraser/动态mod声明修正，未用占位/伪图或改源时序。

最终源数据重提时确认Lua表键顺序不稳定，提取器改为固定排序输出harasser-data/source JSON，数据值不变；最终web与build数据模块逐字节一致。重建后399Node与harasser-browser-final、增强箭弹实际Canvas旋转矩阵的harasser-browser-matrix、完整天然9模式harasser-campaign-final→ui-final→performance-final全部正常exit0。最终build1518files72,851,663B；冷100ms/1.5MBps/cacheoff14,721,695B，book6.283s/总15.338s232requests，无整atlas/OTF/新图，15MB预算不变且不保证普遍线路速度。原spear/shield回归也正常exit0，无run-owned挂起待收。

### 0.2.109 骚扰者后跳闪避与影袭连续流程

仅读APK game_scripts8903–9021完整跳跃分支、unit_dodges138–157、enemy_basic494–559（没有重置dodge.ts字段）、原grid_db193–199 ceil/clamp与cell_size16、path_db原节点/visible margins10/1/2、game.resize70–170可见范围。tools/extract_harasser_jump.py/read_harasser_jump.lua固定原game/constants/grid/path/scripts/script_utils/game_scripts与三grid/path SHA，声明读取不执行控制器，接完整extract_campaign。原4–6初始grid在中心lane路径节点没有Faerie1024位，预计算仍保留该精确查询结果；纯测注入阻挡节点只验证拒绝门，不伪称原图有Faerie。当前动态地形/invalid-ranges生产链尚未全恢复。

近战兵/英雄原命中调用接新harasser helper，严格time-ts>7、stun/freeze适配、requires_magic、NO_DODGE与rangedfalse先门控，再一次chance RNG；dodge.ts沿原模板0非出生时钟（区别于rangedAt）。source controller随后清active/设ts，整数随机-18..-10节点并clamp(nodeslimit10,endnode-10)，无效或lane1中心Faerie拒绝但cooldown/随机已消费。源source节点近距strict<2*speed*dt、每tick最多前进一个的职责在现World路程模型中跟踪，非完整原native path scheduler。可见节点按源viewport width ceil/ref768/clamp4:3..16:9/居中1024和pan_extension推导，Campaign传初始viewportAspect，直接World默认4:3；非零safearea仍未支持，未称整个viewport/native像素完成。

成功先解除士兵/英雄近战阻挡与未提交近战攻击，保留已发/待ranged弹，source bans备份后F_ALL、已知gnawer/burn图面随jump隐藏但DPS不关；jumpOut14帧完才原lane/node/d换位，再jumpIn14帧，随后恢复bans/清_bans/显示已有modifier图。warp tick velocity置0，不能当下一发预测的巨大移动速度。Source active dodge等待既有ranged phase完成/被stun时等待，不凭感觉直接砍掉四连射；移除World即清理，无异步timer或跨场景缓存。

恢复后最近合法shadow_shot目标，原26帧别名动画、14/30释放；arrow_twilight_elf_harasser_shadowshot走普通arrow固定flight22/30，不是.108随机flight插入，25–35原实际物理伤害/strict22/no burn。源ranged=false意味着不能闪避远程，并非全免伤；当前F_ALL只闭合塔/兵/英雄新目标选择，World.hurt没有新全局免伤，已发/直接伤害照原现路径处理。技能AoE目标链、完整native queued damage/IDs/特殊死亡/全modifier-auras隐藏链仍欠，未借本批称全harasser/native视觉认证，更未开放4–6。

406Node全过（7新纯测）：strict7与原0时钟/flags/magic/RNG、节点/viewport/Faerie拒绝、先jumpOut后迁移/14+14帧/flags恢复/shadow正常22/30箭与25–35伤害、拒绝消耗cooldown/node RNG、ranged/stun等待/非全局免伤/暂停、真实hero melee触发与warp速度0/World隔离。actualbuild test:harasser-jump由真实World.updateHero起近战并触发dodged，验证敌HP未因该近战减少、解除combatTarget、原节点/14帧phase/跳入Canvas源q/alpha/绘制只读、shadow箭、真实pause/zoom/mobile/map清理。受控位置/节点与模拟时钟不是自然第5关或原版同步像素验收。harasser-jump-in/shadow-shot/mobile已人工看；原四连射/spear/shield回归与原天然完整九模式/UI/性能均独立收集。

最终406Node、jump-browser-final（额外在F_ALL跳跃中直接hurt验证HP仍减少）、原volley/spear/shield回归、jump-campaign天然原9模式/存档手机→jump-ui→jump-performance全部正常exit0。三个campaign20命、第三campaign入关自然XP4705，末XP继续增长，旧数值/策略未改。最终build1520files72,858,659B；冷100ms/1.5MBps/cacheoff14,728,391B、book6.300s/总15.340s234requests<15MB，无新图/整atlas/OTF、不抬预算或降质，旧塔compact1314帧2,122,316B保持，不保证普遍线路速度；新关自身预算仍未验。公开一次manifest确认.108，首UI一次projectile-sprites.mjs HTTP503收exit1，独立不改门控/超时/产品的jump-pages-ui-repeat最终exit0，不拿首失败冒通过。全部结果已收集，无挂住浏览器待处理。当前仅已知塔/兵/英雄新目标获取按jump bans过滤，powers/AoE仍为既有适配，未称整个F_ALL/native damage链已全恢复。

## 0.2.110 第6关上层守卫射击

只读原APK game_scripts17554–17557/17568–17581、scripts.arrow1947–2130、SU.soldier ranged1084–1248与模板/level06声明；tools/extract_gryphon_guards.py和tools/sources/gryphon-guards.json记录源SHA/范围，未执行控制器。原两位置/区域/动画/随机aura冷却/前摇/预测误差/抛物线/接触真实伤害已接，原免普通伤害和不可近战/远程选取的守卫以专属集合隔离。source剩余节点用现World路程换算、已知viewport边界复用；不是原native调度同输入复现。下层守卫、狮鹫脚本、完整通用modifier/auras和全关图层/预算仍未完成。

新增纯测覆盖原两实体/无假下层与援军寿命、椭圆闭边界、aura单tick随机不补发、World真实7帧释放、预测轴随机/原偏移/12帧弹道/10伤害、stun/maxtrack/移除/暂停与旧关隔离。实际build专项捕原Canvas q/alpha/箭角矩阵与绘制快照不变、真实World发射伤HP、原600金币不变、真实pause/zoom/手机/退出地图。位置/时钟受控样本非自然第6关通关或原版同步像素验收。

最终412项Node全过；guards-browser.log/guards-browser-matrix.log、guards-campaign.log原完整天然九模式/存档手机、guards-ui.log与guards-performance.log均正常exit0。三个campaign20生命，第三campaign入关自然XP4705，末九模式XP继续自然增加。最终build1522files/72,862,238B。100ms/1.5MBps/cacheoff真实book入关7.171s/总16.229s、14,731,668B/236请求<15MB，无整atlas/OTF/新图/抬预算/降质，不保证所有线路。新第6关自身预算未验；截图gryphon-upper-guards.png/mobile为受控流程，不称全关像素验收。初纯测只改敌xy未同步route.d被下一tick拉回，以及第二守卫合法发箭令单守卫中断断言失败，已修fixture同步路径/限定受测守卫，未改产品门控。

## 0.2.111 第6下层守卫探身/退回

只读原APK game_scripts17560–17563/17586–17644、SU834–868、utils.walk473–519和systems.tween1288–1386，扩展extract_gryphon_guards.py与source JSON固定SHA/完整lower模板和区域；不执行控制器。原wave>=1、random1..3等待、yield后75速度走到show、到位后恢复射击、max(attack.ts,lastShow)严格>5退回、完整.5秒正反alpha与lower原射击区域/1秒cd接入。原controller探身center=this.show确实nil，原初始attack.disabled确实nil，所以初次透明等待不强加disabled；首次退回禁用后到下一次到位才清除，未把alpha当伤害或选敌门。原原生协程/队列/全modifier仍有适配边界，未称所有守卫与关卡脚本已完。

新增6纯测wave无随机/源缺省、75speed与arrival后一tick/空center、正反alpha/只读pose、strict5/新attack推迟退回、原区域与实际arrow释放/暂停owner。actualbuild test:gryphon-lower真实双击入口开波后隔离pending/enemy作受控样本，捕running/shoot Canvas q/alpha/实际矩阵位置和World快照不变、原到位/真实HP下降/600金币不变/退回与禁用、真实pause/wheel/mobileCDP触摸/地图清理。并非自然第6通关或原版同步像素。首browser将已camera.project的screen再次套camera导致expected矩阵错误，改baseScreen单次变换，不改产品；首pure取浮点55/150乘150的上边界431，实际IEEE754落在边界外，改精确x半径闭边界校验，不给产品加epsilon。

418Node全部通过，lower-browser-final与补齐源断言/注释后的最终lower-browser-release、原upper回归、lower-campaign完整天然九模式/存档手机、lower-ui与最终lower-ui-release/lower-performance-release均正常exit0；三个campaign20生命，第三入关自然XP4705，九模式末XP继续增长。最终build1522files72,865,897B，最后重包仅源注释/审计注释变化及必要字体subset刷新，无模拟逻辑变更，仍跑最终包Canvas/UI/性能。cold100ms/1.5MBps/cacheoff14,735,327B/236requests，book7.168s/总16.249s<15MB，无整atlas/OTF/新图/抬预算/降质，非所有线路保证。公开一次manifest确认.110且lower-pages-ui正常exit0，新推送不轮询。截图gryphon-lower-shoot/reveal/retreat/mobile已人工看，受控时钟/清空待生波次以隔离守卫，不冒自然第6关或原版同步证据。

## 0.2.112 第6狮鹫援助流程

只读level06.lua22–46/48–151、game_scripts17650–17860与path_db.nodes_as_list，恢复原mode waves/delay/side/cooldown、六条4控制点Bezier、两layer动画/影子/flash/sign、三弹扫射和专用魔法AOE/FX/弹坑、approach/land/点击takeoff重复。tools/read_gryphon_waves.lua仅loadfile得到编译chunk后读取jit.util.funck的proto/TDUP常量，不执行chunk或任何level controller；extract_gryphon_events.py固定原SHA/范围，读数据声明并接全量提取。现有扩展紧凑图已有316个ally_gryphon帧，未下载/裁新图或加载整atlas。

专用bolt source attack每.1秒loops3各随机x(-20,20)/y(-30,30)/initial_impulse(0,1000)*30；后者controller不读取，保留随机消费但不造物理。原bullet.update speed300、接触strict distance<2*speed*dt，AOE在最后实际位置而FX/decal在to；原damage100..120/type4/r30/.7椭圆，可包括飞行目标，没套普通arrow的homing/dodge/火DOT。新bolt动画fps10通过原animation_db110–163非循环ceil(ts*fps+1e-9)索引桥接当前Renderer，不改旧弹动画。

状态全归World，原source coroutine本身一tick落后Bezier取样职责保留，完整native调度/queueIDs与damage队列仍适配。source sign5秒hidden/1秒shown和各自alpha/scale prop时长反放，影子不跟body水平flip，approach只改变原指定offset，land隐藏影；原两body/影/flash原z和alpha同queue，不拿视觉offset参与sort_y。现通关后Alleria/spawner/囚车/首领源链未实现，新关仍隔离关闭，不称第6全关验收。

最终425Node全过；actualbuild gryphon-events-browser-final与追加手机CDP右侧飞机触摸起飞的browser-touch、原lower守卫回归、gryphon-events-campaign-final天然原完整九模式/存档手机→ui-final→performance-final全部正常exit0。三个campaign20命，第三campaign入关自然XP4705，末九模式XP继续累加；旧World数值/策略/RNG未变。实际build1524files72,878,801B，cold100ms/1.5MBps/cacheoff14,747,929B/238requests，book7.199s/总16.432s<15MB，无新图/整atlas/OTF/抬预算或降质，不保普遍线上线路。公开一次manifest确认.111且pages-ui正常exit0；新推送未轮询。strafing/impact/landed/takeoff/mobile当前样本已人工看，源520金币/iron1生命是真模式值，测试清pending并留场外sentinel保证采样，额外ettin在真实路径节点承受真实攻击，属于受控场景，非天然第6关通关/原版同步。初包也全过，后补只对新bolt原animation_db fps/epsilon规则并重跑完整最终包，不拿初包冒最终。所有结果已收，无浏览器产品失败/挂住待处理。

## 0.2.113 第4关焚林/道路/建造点

只读原level04.lua22–196的load/update/y_burn_zone及闭包，APK第5/10波、can_hover与Z_DECALS为权威，mixed源码只交叉（其holder分支缺hover/z，不照抄）。read_stage4_burn.lua仅loadfile获得proto，再jit.util读取0.37/0.555/0.2/.46与nodeAdvance3；constants声明读取Z_DECALS1400，未执行level顶层/load/update。extract_stage4_burn.py/source JSON固定SHA/规则、动态声明与真实tower锁缺口，接完整提取。

恢复原纵火者行走/前摇/火把/两种爆炸、树烧毁/火/焦痕/land错峰淡出，source正负x排序决定传播方向；24号从真实禁用/1199层到真实可买/1400层，path3/4按5/10波打开，challenge开局即开。脚本纵火者只演出不算可攻击敌人，1秒后才实际spawn原burner，同road2/lane1/最近node+3再insert+1连接段（既有路程/原native节点仍适配）。完整source coroutine/timed删除次序/全grid/audio/nativeIDs仍欠，不称同输入pixelcert。

新增7纯测涵盖5而非6波、45速/8+12+5帧、原场景传播与alpha/只读原JSON/双轴scale、真实holder24禁买不扣钱和开后70交易、两个路径/challenge门、真实额外敌人node连接和只生成一次、暂停/owner与旧关隔离。actualbuild专项用隔离stage4真实开波后受控wave5/10/清pending，捕Canvas原q/alpha/双轴矩阵、draw前后World快照不变、源road与holder DOM disabled解除、实际70买塔/500→430、真实burner进入road2/pause/wheel/mobile/退出旧存档unlocked1。不是天然第4通关或原版同步，Arcane尚未实现且新关关闭。

432Node全过；actualbuild stage4-burn-browser-final（等原build-menu.hidden再拍/手机CDP真实pause）、stage4-burn-campaign天然原九模式/存档手机→ui→performance全正常exit0。三个campaign20命，第三campaign入关自然XP4705，末九模式XP继续增长，旧策略/数值不改。公开一次manifest确认.112且pages-ui正常exit0；新推送未轮询。build1526files72,887,137B，cold100ms/1.5MBps/cacheoff14,755,973B/240requests，book7.167s/总16.326s<15MB，无新图/整atlas/OTF/抬预算/降质，不保普遍线路速度。stage4-burn-zone1/zone2/mobile已人工看，附最终zone2图；受控推进wave与清pending非天然第4关/原版同步。专项全部无产品失败/挂住，初截图menu处于原hide中途已等真实隐藏重拍，不改产品动画或门控。新关资源自身预算/Arcane/完整通关仍待验，整体非1:1。

## 0.2.114 奥术弓箭塔基础分支

原Arcane controller240–362/246–274闭包只读-bl核对两射手与flight职责；普通arrow1947–2130、mod_damage5328–5342、health的DAMAGE_MAGICAL_ARMOR及raw magic armor clamp交叉核对，不执行控制器。extract_arcane.py固定7源SHA和4张原PNG SHA，声明reader隔离scripts，仅将tower_arcane/普通arrow/mod/hitFX合并隔离ExpansionRepository。266帧373,782B原PNG紧凑lazy组逐RGBA/size/trim验证；9号肖像直接原PNG裁取并exact roundtrip，UI602图。最终旧塔compact仍1314帧2,122,316B，不把Arcane整图塞旧启动链。

源升级目标action_arg真正验证，archer1→2→3→Arcane分别70/110/160/230累计570；wave0全部spent退款，战斗floor570*.6+.5=342。原第3关已允许基础3级、锁全部高级塔，第4原锁7种但不锁Arcane；旧关rules不改，没有全局加第五基础塔或开新关。原高级两技能未完成，明确disabled，不能假购买。

原strict>.8冷却、两动画相隔.1、4/30首箭后再.1第二箭，目标取前列列表，释放时原欧式range重验；射手offset和上下弹口按原目标方向，flight=min11/30+distance/200*10/30，预测采用现模拟motionVelocity与原非零轴误差，fixed destination/g-900/tick tangent/strict22接触。每箭contact才ceil frandom11–18物理伤害，原mod再消费一次math.random(.03,.03)并累计减raw魔抗，夹0..1；不是把魔抗削减当额外HP伤害。get_info按两箭显示22–36。命中FX原8帧/3300，塔与两射手/气泡/箭原metadata同actorqueue，不改变offset-sort规则。完整原special powers/blood/pop/water miss/native modifier/coroutine/IDs仍欠；原RNG/路径/模拟器适配不称Love同seed或逐帧同步。

438Node全过（6新），actualbuild arcane-browser-release真实菜单购买/升级、因160不足230拒绝后用真实ettin死亡奖励70补足，0金币截图来自实际总570支出。控时钟发出两箭，Canvas q/alpha/tick旋转矩阵/World绘制前后不变，真实HP下降/.03魔抗削减、pause/wheel/mobileCDP触摸/地图清理unlocked1正常exit0。桌面/手机图已人工看，为隔离第4关受控目标与时钟，非天然第4关或原版同步。

最终实际包原完整天然九模式/存档手机→UI→性能→公开UI串行全exit0，三个campaign20命，第三campaign入关自然XP4705，末XP继续累加。首campaign命令漏TEST_URL默认8765连接拒绝exit1，已正确8766独立完整复测通过，没有改产品/门控；remote UI断言后关闭稍慢，最终自行正常exit0，未TERM冒通过。冷100ms/1.5MBps/cacheoff14,763,121B/241requests，book7.199s/总16.400s<15MB，无整atlas/OTF/抬预算/降质，不保普遍线上速度。新关自身资源分组预算仍待验。公开一次manifest.113且arcane-pages-ui正常exit0，新推送后不轮询。logs artifacts/arcane-tests-release.log/build-release.log/browser-release.log/campaign-final.log/ui-final.log/performance-final.log/pages-ui.log。

## 0.2.115 爆裂箭原购买/箭弹payload/范围特效

只读APK game_scripts240–362/246–274、aura_arcane_burst14239–14277、scripts.arrow1989–2130结束payload分支及all-phone/game_gui原upgrade_power交易/构造；声明读取仅templates/菜单/GUI数据，控制器未执行。extract_arcane.py固定10个源SHA与4张原PNG/菜单PNG SHA，原7模板/268帧377,542B逐RGBA/size/trim验证。UI增加powerPlaces和原rank1/2/bg，3图直接APK PNG exact roundtrip，旧UI编码不改，总605图。旧塔compact1314帧2,122,316B不变，新Arcane组不进前三关冷路径。

爆裂箭每档200/cap3，累计spent含技能600，1170战斗退款702。源changed level1观察时起12秒，等级2/3不重置既有at；若快速双买先观察到2级，仍保留原sa.ts0而非undefined。普通/特殊射手索引共用，special13/30放一箭，range重新检验1.1倍，继承原特殊箭flight_min.7/距离factor/预测/g-900/切线/hide6。箭结束不依赖direct hit也queue payload，下tick只一次80/160/240 magic伤害，无随机AoE值；source既存target.pos为查询中心（包括死但尚在集合的target），已移除才fallback to，而FX画面仍to。ground decal按AOE伤害队列提交前目标alive/非flying决定，保留两层1400各自alpha/scale tween；14帧3300爆炸anchor.5,.2916667/sortoffset-7。完整血花/特效字/水面miss/箭尾粒子/原音效/升级flash/native协程与modifier链仍欠，sleep未做继续禁用，不称整个tower/4关逐像素完成。

446Node全过（8新）：原购买价格/拒绝/上限与退款、首次观察/连续双买clock、special单箭/射手交替、miss/dead/removed payload、AOE固定数值/flying、画面中心与伤害中心区分、两层alpha/scale与只读、pause/owner/旧关隔离、最后直接击杀等待payload而不提前won。最终串行npm test→build→burst-browser-publish→普通双箭回归→burst-campaign-publish完整天然旧九模式/存档手机→UI→performance全部exit0。三个campaign20生命，第三campaign入关自然XP4705，末XP继续增长。专项源World.step真发特殊箭/真实菜单三次200购买/原rank图cap和满级tooltip收起，actualCanvas原q/alpha/独立matrix/分层与World快照不变、两种真实敌人各失240/金钱保持自然奖励、pause/wheel/mobileCDP/地图清理通过。受控stage4时钟/目标/原敌击杀供购买，不是天然新关或原版同步。impact/rank3/mobile截图已人工看；技能购后30金币，impact48是原perython死亡奖励18，不是直接改gold。

早期纯测写错order.sortY字段/期望y106，source字段是y且to.y99-7=92，改fixture；增强Canvas矩阵1e-6物理px阈值遇Chrome float32（实际672.4674682617188 vs数学672.4674700264931），矩阵平移改1e-4物理px/scale1e-6并按真实sheet筛选，不改产品坐标/像素。首final专项误在build结果未完整收集前启动，boot30秒超时，未当最终包通过；最终严格串行build后重测全通过。最终修购后下一rank说明/满级tooltip收起后，再完整final build与旧9/UI/性能，不拿旧包冒最终。失败logs原样留ignored artifacts，无挂住待收。

最终build1534files73,327,461B，cold100ms/1.5MBps/cacheoff14,769,294B/242requests，book6.300s/总15.568s<15MB；无整atlas/OTF/抬预算/降质，不保普遍线路设备速度。新关自身7.3MB整包仍需实际分stage预算，不以旧路径通过称新关也通过。公开一次manifest.114且burst-pages-ui正常exit0，新推送后未轮询。最终logs artifacts/burst-tests-publish.log/build-publish.log/browser-publish.log/base-browser-publish.log/campaign-publish.log/ui-publish.log/performance-publish.log，公开pages-ui.log。第4–6入口继续关闭，releaseReadyfalse，整体in_progress。

## 0.2.116 睡眠箭与原计数眩晕

只读APK自有insert game_scripts14888–14903，确证调用mod_stun.insert成功后queue mod_arrow_arcane，并将第二sprite.flip_x=false；原pATCHING FLIP日志确实属于APK。通用scripts4440–4488/4490–4549/4551–4561、script_utils stun_inc/dec（ignore_stun/stun_count/is_stunned）及systems.mod_lifecycle完整同级/替换门只读交叉核对。t.modifier没有animation_phases，duration4，不凭感觉造睡醒/受伤唤醒。数据提取仍不执行controllers，Arcane10模板/原268帧377,542B，源SHA/规则见tools/sources/arcane.json；没有新增位图或旧compact扩张。

实际三级180购买/cap/spent1110/战斗退款666、20/16/12秒原special选敌（F_STUN/F_BOSS），普通物理命中才排队4秒modifier，成功新insert才额外.03减魔抗。同级刷新延长duration但不增加计数/减甲/重播动画，高阶替换、低阶拒绝；忽略stun的unit仍保留原显示/减甲；到期/死亡/移除只减自身计数，不清外部stunned适配位。攻击者/目标不因睡眠获得hurt免疫；移动/未提交攻击停、既发弹继续，ettin原忽略stun回血、carrier普通stun释放接入。原完整native insert/damage队列/通用外部modifier生产、逐帧resume/animation_db边界仍适配，不称原同输入或Love同seed。

454Node全过（8新）。实际build slumber-browser真实原菜单70/110/160/230（用原ettin奖励补足）与三次180（8个原ettin死亡560收入）后20金币，非直接加钱。World.step真实发射并直接命中、下一tick计数/魔抗、四秒停位与解除恢复、hurt仍减HP/不唤醒；两层3000原q/alpha/flip/unit offset/Canvas矩阵与World绘制快照不变，14帧hitFX声明/寿命，真pause/wheel/mobileCDP/map清理unlocked1全exit0。截图stunned/mobile/rank3受控第4关目标/时钟/塔blocked状态样本，非自然新关或原版同步，桌面/手机已人工看。

爆裂箭、载兵、harasser后跳专项回归，原天然完整九模式/存档手机→UI→性能均正常exit0，三个campaign20生命，第三campaign入关自然XP4705，末XP继续累积，原旧数值/策略不改。最终build1536files73,334,469B，cold100ms/1.5MBps/cacheoff14,773,613B/244requests，book7.169s/总16.423s<15MB；旧塔compact1314frames2,122,316B，无整atlas/OTF/抬预算/降质，不保普遍线路速度。公开一次manifest.115且slumber-pages-ui正常exit0，新推送不轮询。logs artifacts/slumber-tests.log/build.log/browser.log/burst-regression.log/carrier-regression.log/harasser-regression.log/campaign.log/ui.log/performance.log/pages-ui.log。无浏览器失败或挂住待收；初extractor文本替换误把slumber字段塞进burst审计断言，已在提取写输出前失败并修正；参考截图脚本一次Python else0语法误拼已纠正，不是产品失败。

另通过官方pagelist核P11/14/17与三CID并下载125s战斗帧，已实际看过原4/5/6地图与在战斗HUD；P9是第3关heroic而非第4。tools/sources/stages-video.json记录原标题/URL/CID/帧SHA。视频页web抓取412，但公开官方API元数据与playurl成功，ffmpeg只取原参考帧未导资源到游戏。第5第二英雄与原level05控制器确证Alleria(40,190)/动态catapult事件仍缺，补充开放门，不以静态波次完结冒自然验收。原参考与本样本输入/英雄等级/经济不同，未称同步像素验收；原视频不含睡眠箭本测试的同输入帧。新4–6仍未开放。

## 0.2.117 分关下载与未通过的第4关验收门

扩展从单张7.3MB改按stage04/05/06依赖取组，各含必要共享场景：1711/1682/2122帧，3,802,488/3,188,742/4,140,874B，原RGBA/size/trim不变，JSON记录输入SHA。完整原图保留重建兼容，不进入新关网络请求；没有改World数值/RNG/XP/旧关规则/存档上限。最初动态printf场景名漏3图，实际浏览器missing捕获后补齐，不靠占位/吞错误。默认desktop不再预取未使用的phone肖像/能力圆图；显式phone流程真实关闭教程/通知后H选择/死亡/冷却与手机bounds通过。

457Node通过。最终运行时与三关预览/源焚林/睡眠箭Canvas回归、原天然9模式/存档手机、UI、旧冷路径均通过；旧100ms/1.5MBps/cacheoff14,655,989B/213请求，book7.183秒/总16.453秒。第4完整desktop HUD隔离冷路径16,006,890B/198请求、book6.712秒/总16.277秒，**15MB断言exit1，未通过**。先前漏desktop底栏的15,628,592B不是最终结果；补齐top import后的结果为准。新关图片不降质、预算不提高，生产仍前三关九模式。最后仅source provenance增加SHA并重build，图面与加载依赖未变。

合法自然策略试跑：前三campaign自然XP738→2519→5277、均20命；以同一真实入关XP分别第4campaign won剩2命/漏13、heroic杀138后漏1 lost、iron95/95无漏怪won。未修改gold/lives/伤害/cooldown/生成；不称新三模式通过/原同输入。另一次第4模式间累积XP试跑铁人失败，日志保留，不拿独立样本冒顺序保证。新关继续关闭，后续应解决剩余加载与策略/机制/源层级门，不伪造解锁。

logs artifacts/stage4-groups-tests-release.log/build-release.log/three-scenes.log/burn-regression.log/slumber-regression.log/campaign.log/ui.log/old-performance.log/budget-desktop.log/budget-release.log、stage4-natural-sample-final.log/results.json。早期phone专项未等通知关闭H未生效，fixture改真实按钮后过；未改产品门控。第一次手机版截图重排未等两RAF造成重复残像，等待后正常并已人工看。公开一次manifest.116，首UI断言完成后Node关闭挂住，比daemon后精确TERM143；repeat完整exit0。通关、原素材及局部Canvas调用均不是同输入逐像素验收。

最终补充输入SHA后build1543files85,167,327B，stage4-groups-three-scenes-release/UI-release正常exit0；最终budget-publish仍以16,006,890B明确exit1，未放宽15MB门。

## 0.2.118 第4关加载达标、升级前图像就绪

塔原1314帧无损拆860帧1,071,438B初始组+454帧二三级分族组；所有size/trim/RGBA逐裁图一致，旧前三关原compact1314/2,122,316B保持。原Arcane268帧独立图在对应升级菜单前decode；新关JSON沿用gzip/readMetadata无损解码。待资源时菜单hidden/inert且不交易，完成后检查World/场景/版本/slot身份/key/level/选择与modal，Escape或换场景不重开；失败可真实重试，未把下载变成World新时钟/新随机。

首次增强实际sprite就绪检查抓到.117的bambi/plant_magicBlosom metadata有但raw sheet未加载。修复共享图logical动画别名/索引解析，最终三关1925/2057/2446帧、4,090,840/3,600,394/4,490,674B，未丢透明RGB或改图。实际四家三级塔交易画面中鹿/四株花已可见，手机与桌面已人工看；受控资源/交易样本不是原版同步。

463Node通过，最终实际build四塔1→2→3/Arcane购买及wave0全退款，延迟加载取消、故意网络abort后不扣费/不升级/重试成功、readonly Canvas/无未加载sprite、pause/zoom/mobile/清理通过；三关预览、焚林、睡眠箭、原天然完整九模式/存档手机、UI通过。source500+3ettin实际210收入供交易，未直接改gold。初browser因真实捕获未加载鹿/花而exit1，产品修复后过；未放宽断言。首.118测试时只按a.prefix全帧导致分组只移8个静态图，生成器已改读真实动画索引后完整拆分；原普通compact没变。未执行任何原控制器。

最终100ms/1.5MBps/cacheoff第4完整desktop冷入口14,566,000B/199请求、book5.856秒/总15.514秒<15MB；初仅拆塔未修鹿/花时14,738,242B不能冒最终结果。所有原一级塔/建造/四预览必需图先就绪，二三级在真实菜单需要前就绪，不假加载/抬预算/降质，未称其他新关预算或普遍线路保证。

自然第4仍未全面发布验收：原训练函数用前三campaign自然XP5277可合法multishot2，优先树屋两兵样本campaign19命/1漏；赚9星经真实buyUpgrade购买天赋后的heroic策略最高140/142仍lost。末两ettin满700HP，hero死于前段且末路无塔覆盖，记录为源机制/策略诊断，未修改回血/伤害/XP/RNG。source max_upgrade_level2限天赋而非塔，旧World.allowed已允许挑战三级及未锁Arcane，不能把测试计划自限二级当产品规则。入口仍关闭、整体in_progress。

最终build1569files88,126,620B；旧冷入口14,657,823B/214请求、book6.268秒/总15.567秒仍<15MB。logs artifacts/tier-tests-release.log/build-publish.log/stage4-performance-final.log/browser-final.log/three-scenes-final.log/burn-final.log/slumber-final.log/campaign-final.log/ui-final.log/old-performance-final.log/pages-ui.log；公开一次manifest.117且完整UI正常exit0，新推送不轮询。所有必需工具结果已收集，无浏览器挂住或未处理产品失败。


0.2.119第4关正式入口与自然三模式验收：见STAGES-4-6.md。新敌照片/肖像与book4原图裁切无损；17照片四角矩阵检查保留。地图第四旗和六道路点来自固定map_points源，不手挪位置。通关证明玩法可用，不等于原版同输入像素验收；5/6继续关闭。

0.2.120原第五关投石车：源时间表/节点进退/原shoot与enemy_bomb伤害分支、137帧无损分组/原肖像/Canvas矩阵与手机已验证，见STAGES-4-6.md。Source enemy_bomb的正spin、last-pos伤害中心与to特效中心不混用我方bomb。实际鼠标pan后截图可见原位置投石车；未手挪坐标或拔高z。局部隔离受控流程不是第5自然通关、全关图层或pixelcert，入口继续关闭。


0.2.121接入第五关Alleria独立基础战斗：原40,190入场/HP210/速度90、近战10–15、普通箭与special三箭、独立眩晕/受伤/15秒死亡等待与respawn、23HP离战回复，不借Eridan等级表/临时援军寿命，不把伤害XP写主英雄。原112帧完整hero动画和箭图独立237帧无损组，只第五关加载。Canvas点角色→道路移动为当前道路适配，完整原grid waypoints/多英雄头像选择栏/猫controller仍未完成；因此第五关继续关闭，不称完整Alleria或整关还原。controller只读-bl，source proof在tools/sources/stage5-alleria.json，特殊死亡/全queued时序/尾粒子音效仍欠。


0.2.122接入Alleria原猫伴随控制器：初respawn完成后queue/下一模拟tick创建，同一owner只一只；原cat不可选择/ignore_damage/F_ALL，不进入普通援军/敌方target枚举，没有补兵/寿命或伪造猫伤害。源game_scripts8307–8371扑击只在.3秒queue音效请求，没有queue_damage。当前保留69速度/10..100距离仅控制前走而非拒绝扑击、46帧attack、2..3秒结束后随机cd、主人近战时scared双播与5..5.333秒cd、死亡toSad→sadSigh→随机1.5..3等待→复活toStand，已经开始的动作/行走不粗暴中断。音频实际播放与idle_flip仍未接，不能称猫全状态1:1。
catRallyPoint读取原level05_grid16格/ceil-clamp/原WATER|CLIFF|NOWALK gate，最近当前有效路径节点-5且拒绝无效，不伪夹到终点。原初始nav_rally.center/pos在APK读global pos(nil)，实例不伪补初始字段。完整NF_RALLY节点flag生产/动态terrain/grid waypoint绕障碍仍是适配边界；当前道路移动与viewport valid-bounds沿既有模型。主人移动请求按原cat下一轮outerloop消费，不能盖掉正在扑击/悲伤wait。Renderer独立cat只读pose进同actorqueue/原anchor.z3000，无血条，World实例丢弃后自然清理。237帧328080B原独立Alleria组原先前缀闭包已经含102猫帧，本批只追加原cat声明/grid数据，没有新图下载或改变RGBA。


0.2.123第五关桌面双英雄头像已接入：原shared desktop与KR3 HudBottom.add_hero交叉，Eridan左框x8/Alleria右框x92、18GUI叠合、separator原pos101,3/anchorY101，powers parent由105移175；GUI纹理768/1080与原102x101按钮尺度不混World贴图。原heroPortrait_L/R1..29、separator与Alleria0019共60帧256498B独立组，固定原声明/控制器/PNG SHA并逐RGBA/size/trim验证，只含stageHeroes的第五关在创建HUD前读/decode。旧单英雄路径保留；DesktopBattleTop.readyPromise包含新组，World/owner/destroy保护取消中的旧请求，不给旧场景回填DOM。
点击右头像/Canvas选择Alleria后只调用其移动API，H与左头像/Eridan终极技能和XP身份独立，死亡会取消右选择并禁用，原遮罩/回复后levelup帧/hover/selected从实际HP/死亡clock读。Alleria原level3、xp11299用5300..11300算5999/6000，不用Eridan成长值；没有伪给XP或改World战斗/RNG/金币。两头像同原一秒outquad下移并恢复，手机同desktop profile真实触摸选择。原完整grid waypoint/Alleria专有infobar/键盘多hero轮选、第五关Blade和整体自然三模式/资源预算等尚欠，不称完整5或1:1，入口仍关闭。source tools/sources/desktop-multi-hero.json与extract_desktop_multi_hero.py接全量提取。


0.2.124第五关剑咏者之殿基础链已接通：保留四基础TYPES，barrack runtime level4映射原tower_blade并验证真实菜单action_arg，第四关原锁blade保持，第五只开放已实现基础升级。275金币原价，三兵HP200/armor.5/速度75，source升级新unit满血/继承存活旧兵位置和集结，不错误沿旧通用比例血量；原预建2级兵营先250到3再275，spent525，战中退款315（wave0全退）。三项perfect_parry/blade_dance/swirling仍disabled/拒绝交易，不称全塔技能完成。
web/blade.mjs独立基础兵controller：源U.attack_order按chance小到大，原attack2(.33)/3(.5)/1(1)、各strict cooldown与forced1秒门，失败只重置自己的ts；5/30命中才提交attack/forced时钟、原10..14整数物理真实伤害，17/18/21帧动画不冒通用attack。source unit_dodges即使chance0仍在合法普通箭/敌近战调用处抽一次；health.on_damage的0级提前返回则不抽，blighter energy与AOE仍直接伤害，不造格挡/全局免伤。原随机姓名/初sprite时钟新单位各消费一次，不改旧单位/旧九RNG。
普通死亡严格15秒后移除，再由原塔开门结束排入新对象三兵名额，非同对象满血返生；door_hold.5/close等待，尸体占名额，tower.blocked不启动新招募。离战2秒后原每strict1秒+25，真实集结会取消未提交攻击。原特殊死亡/blood/pop/audio/native队列ID和完整路径/插入时序仍适配。基础revive.disabled默认true，未伪造启用未实现高阶天赋。source upgrades proto99 TDUP41仅列basic1..3的fencing（所以blade不降价），TDUP45包含blade的expert rally（145→160），只扩新模板此作用，旧数值不改。
新142帧301774B blade独立组按实际逻辑动画indices选完整门/兵动作，无损RGBA/size/trim/原PNG与controller SHA审计；不把整个物理door prefix覆盖旧1..3门图。仅stage5/6隔离catalog含声明/frames，真正3级菜单预览与交易前由原prepareTowerMenu decode，四关首包/原towercompact1314frames2122316B不变。原portraits_towers0005直接APK PNG exact裁图，UI617图，其余编码不改。tools/extract_blade.py/read_blade_upgrade_rules.lua/source blade.json全量提取已接，controllers只-bl/原proto常量读取不执行。


## 0.2.125 Blade perfect parry

原APK on_damage1673–1691/update1709–1884、SU2174–2280与health939–1104只读-bl核对。每档175/三档，counter固定3 true damage不随等级增加；原mixed额外damage_inc分支不移植。两秒计时从开始、5/30前摇、strict间隔每tick最多一次，原动画loop/anchor/trim/alpha同actorqueue，draw不改模拟。普通格挡与health回调不同；ignore_damage仅反击活跃期间生效。音频、全部特殊death/modifier/nativequeue尚未全还原，不称整体逐像素1:1。


## 0.2.126 Blade swirling

原tower能力300/max1与soldier三攻击damage_inc5/cooldown_inc-.2、SU2174–2280 forced_cd=min逻辑核实。普通攻击15–19/.8秒使用原动作与5/30命中，非新造技能动画；反击3 true伤害不追加mixed伤害。源码与图SHA/逐RGBA校验沿原Blade包，不新增整atlas。升级flash/完整音频和native协程同输入仍未恢复，不冒称全部原塔或全关像素认证。


## 0.2.127 Blade dance

APK1709–1884/1820闭包与utils原slot1/计数/重试完整只读审计。三档250、四击最高40–56 true伤害，三种原随机出手动画，125椭圆/最少两目标/strict9秒。出场、瞬移出手、原点回位按原帧/anchor/trim同actorqueue绘制；不移植mixed额外damage_inc*swirling。伤害/动画与World快照专项为受控样本，非原版同步或自然第五通关；源图不是全关像素认证。音效/部分flash与native调度/完整global IDs等仍欠。
