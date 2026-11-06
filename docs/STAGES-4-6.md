# 第4–6关还原工作区

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
