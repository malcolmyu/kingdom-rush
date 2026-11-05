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

- 第4关：双头食人魔完整特殊死亡/外部modifier生产链、枯萎者完整特殊死亡/音效及modifier生产链、载兵飞行敌人完整特殊伤害FX/完整原协程调度、树屋招募，以及本关原脚本事件。
- 第5关：暮光骚扰者闪避/远程攻击、预建兵营与新塔解锁。
- 第6关：狮鹫上下守卫/演出事件、对应关卡脚本；高级塔解锁和机制。
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
