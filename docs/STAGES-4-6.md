# 第4–6关还原工作区

人类要求从2026-11-05起优先继续后面三关。当前公开可玩仍前三关九模式；后续三关的原始数据与美术已独立接入，尚未开放战斗入口。没有将缺失的特殊敌人/关卡脚本当普通敌人发布，也没有修改旧存档解锁上限。

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

- 第4关：新敌人完整特殊死亡/音效及通用modifier生产链、奥术塔剩余技能与本关完整自然战斗验收；树屋和5/10波焚林已接通。
- 第5关：预建兵营完整职责与本关允许的其他高级塔；骚扰者远程/后跳影袭基础分支已接通。
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
