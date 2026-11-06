# 第7–10关还原工作区


## 0.2.144：第7关 faerie 暂存运输（隔离验证）

`web/stages/faerie.mjs`接原18716–18858/18864–18920的基础连续流程。按原FAERIE1024格与每条道路第一lane编译半开区段，原第4路[35,70)、第5路[77,110)，索引保留一基；实际数据无开放尾部，不凭猜测填源global ni。path_speeds数字0/1保留，默认yellow30、显式red75。独立nav移动，不覆盖敌人speed；移出战斗集合、释放当前减速/中毒/睡眠/ward所属效果、解除当前blocker，保留原对象/HP/gold/id。limbo保持Hoplite组计数，重插不重加；恢复原对象后重启已接controller时钟。已发普通hurt持有引用时仅第7拒绝limbo伤害，不给旧六关增加state/RNG。

原两层同色nav（静态球+原动画）与入/出smoke、大小比例/anchor/z/tween纯绘制；原粒子发射器、完整通用mod/aura移除、native insert/remove队列与IDs、stun_force全部状态、所有敌人重插协程和动态路径仍为适配或待补，非原版同输入1:1。当前释放自己拥有的睡眠计数，保留外部stunned/其他计数；并非通用清空眩晕。source新增nav/fx/粒子声明闭包，4679逻辑帧/6,369,762B无损，未清alpha0RGB/整atlas；旧4/5/6图与1314frame compact保持。第7入口仍closed、正式前六关18模式，自己的预算和其余必要机制仍欠。


最终639Node全部通过（9新faerie），actualbuild faerie-browser-publish真实Space后World.step自动暂存/运输/原对象恢复、原Canvas q/alpha/已decode/绘制World快照不变、离场hurt无HP/XP/金币变化、真实844×390 CDP touch暂停与地图完整progress保持正常exit0。黄光/手机图人工看过；受控原区段节点与队列，不是天然7或原版同步认证。已释放Hoplite spawner没有owner_id，父兵运输不会擅自interrupt它，新增纯测覆盖。Hoplite专项、最终build旧九模式/手机存档与UI全正常exit0；连续新档4/5/6合法自然链保持原19/20/20命与各挑战/XP47121真实奖励。所有运行模块和新资源逐字节等build，source pinned重提通过。

最终cold100ms/1.5MBps/cacheoff旧14,857,387B/240req总16.911s，4真实旗书14,814,765/230req书7.192/总17.016，5真实旗书14,998,071/241req书7.846/总17.647，6真实旗书14,938,744/240req书8.131/总23.680，均exit0，不保所有线路；第五余1929B，后续必须继续按关lazy。第7隔离16,929,836B/233req书7.463/总17.554，15MB assert明确正常exit1，base/progress/draw不变且无missing/unready，不冒预算通过/正式旗7书7/全局整局15MB。第六boss/cart后期仍另下载3.87MB。

本轮公开manifest单次确认.143；public UI导航net::ERR_CONNECTION_CLOSED正常收exit1，未冒通过、未循环重试。当地最终UI正常exit0。日志artifacts/faerie-source-final/tests-publish/build-publish/browser-publish/hoplite-regression/old-nine-publish/ui-publish/natural4/natural5/natural6/performance-publish/stage4-performance-publish/stage5-performance-publish/stage6-performance-publish/stage7-budget-publish/pages-ui.log。公开网络失败和第7预算失败均保留，不拿它们冒产品通过。

## 0.2.143：重装羊人召唤与并发计数组（隔离验证）

第7关仍closed，正式仍前六关18模式/cap6。`web/stages/hoplite.mjs`接原enemy_satyr_hoplite9376–9433、ready闭包9382–9389与共享enemies_spawner785–899。spawn时抽一次spread_seed整数1..10并起timed.ts；strict8/8/8/6秒、can_do_magic、组并发<12、当前道路距防守节点>60才可起cast。行走episode用floor(time*10)%spread_seed分散检查，不把source chance1字段误当本控制器额外随机。

原cast55帧，第16帧后queue隐形spawner，下一模拟tick开始；3次尝试各按原allowed_subpaths1/2/3随机子路、当前节点偏移-12..-7，检查active/当前viewport可见节点和invalid ranges，失败不夹路径终点/不补假兵，也不抽该次cycle等待。成功queue原enemy_satyr_cutthroat，原random_cycle0..1秒（最后一次也等待）后继续；没有owner_id，已完成施法的生成器不因后续主人移除自动消失。前摇眩晕取消不写成功cd；释放后的动画等待被stun/death打断则interrupt生成器，已queue的孩子仍提交；正常结束才把cd.ts再次写到动画结束时钟。节点/viewport/回调调度使用当前World路程适配，并非原native导航/协程同帧认证。

生成实例原HP/甲/速度照模板，唯原keep_gold=nil使实例gold=0，模板仍15。孩子原raise14帧保持原节点、不移动/攻击、世界血条暂隐藏；不是全局免伤，仍可被真实伤害。原召唤声只生成scoped sound请求，完整声音播放尚未接，不虚构已发声。原共享计数组只在实际insert时+1，pending不预占；死亡不减，strict>2秒尸体移除才释放，原普通opaque尸体保留到期。limbo移除不减、再插入不重计；这是当前固定CONCURRENT1单组适配，不冒完整count_groups引擎。原max12是每次ready/生成尝试的准入门，不额外预占pending/硬夹数量去改变source队列顺序。

World/Renderer只补可选busy/keepCorpse/healthHidden/opaqueCorpse接口；仅stage7 loader提供，旧1–6无新state/RNG。排队的spawner/孩子会阻止普通末波提前won。无新PNG，4623逻辑帧6,314,902B/map847,936B原RGBA/size/trim保持；原4/5/6图1925/1815/2204帧4,090,840/3,175,904/4,109,998B与oldcompact1314帧2,122,316B不变。extract_stage7/read_hoplite_functions/rules记录原继承与constants/pins，控制器只-bl、声明stub与constants可读，不执行原controllers或mixed作弊补丁。

630项Node通过（10新）：含随机draw数量、held cast不被silence凭空中断、12共享准入、零金币/尸体计数/limbo、无提前won和raise并非免伤。actualbuild hoplite-browser-repeat真Space后World.step自动原8秒准备/cast/spawner/三孩子raise→正常羊人双刀实际伤援军（40→33与40→34）。父原600HP/0.5甲；kill父真实+60gold，kill孩子0gold且计数仍3，尸体1.33秒仍在、2秒后释放为2；没有假给主英雄XP。source body/raise Canvas q/alpha/矩阵、原hidden bar职责、完整循环安全World绘制快照不变、无missing/unready、真实pause/wheel/844×390 CDP touch、地图全progress保持均通过。test只控制宿主RAF避免双时钟，实际调用绑定的原World.step；路径节点/队列/时钟是隔离fixture，不是第7天然通关或原版同输入pixelcert。

首次手机pause在关闭桌面dialog/viewport布局仍过渡时就点击旧坐标，断言失败保留；fixture改为真实等待modal/veil关闭和两次RAF再取button bbox，未改产品门/动画/触点放宽。桌面/手机raise与squad图已人工看。原faerie_trails暂存导航、蜘蛛蛛网、原Druid/高级塔与mode锁/7的Wild允许范围、Ready/敌通知百科/完整音频、自然模式/自身预算/旗路书奖励cap7等继续待做，不称21模式。

最终actualbuild1680文件104,610,774B含manifest；所有运行模块与stage7资源逐字节等build，source pinned重提成功。旧九模式/手机存档、satyr/pumpkin实际回归、UI与公开.142 UI均正常exit0；连续新档4/5/6自然链全过（4campaign19命/heroic142/iron95；5campaign20/heroic201/iron147/XP37600；6campaign20命零漏/真boss收尾→heroic120/iron169/XP47121），旧策略未改。

最终cold100ms/1.5MBps/cacheoff旧14,857,128B/240req总16.070s；第四14,814,506/230req书7.203/总17.063；第五14,997,813/241req书7.844/总17.744；第六14,938,482/240req书8.180/总23.728，均正常exit0，不保所有线路。第五仅余2187B，后续按关lazy不静态塞大声明。第7隔离冷 **16,867,614B/232req**、book7.428s/总17.624s，15MB assert正常exit1，base/progress/draw不变、无missing/unready，仍未通过预算、非正式旗7书7入口；不抬门槛/降质/清透明RGB/漏当前必需图。第六boss/cart后期额外3.87MB仍是真实下载，不冒整局15MB。

主要logs artifacts/hoplite-source-pinned/tests-final/build-publish/browser-publish/satyr-regression/pumpkin-regression/old-nine/ui/natural4/natural5/natural6/performance/stage4-performance/stage5-performance/stage6-performance/stage7-budget/pages-ui.log。旧手机触点失败保留；恢复桌面viewport后截图也需等两次RAF，不拿尚未布局稳定的HUD残影作最终截图。

## 0.2.142：羊人两次掷刀（隔离验证）

第7关仍closed，生产前六关18模式与cap6保持。本批接通enemy_satyr_cutthroat原三段远程：start1帧完整等待后，loop22帧内第5/15帧各排队knife_satyr，end1帧再返回普通行为。初始cooldown按真实insert时钟，难度3/3/3/2.5秒；chance1仍抽随机。loop前摇/收尾的眩晕转end，start/end保留各自源等待；已提交的刀不因来源死亡而消失。攻击期间拒并行普通近战/移动，不用假的stunned或blocked字段控制行为。

飞刀原main_script继承scripts.arrow.insert/update（1947–2130）；其predict_target_pos=false，所以即使prediction_error=true，也不抽预测误差或自动追踪。release用当时目标pos+hit_offset，下一Worldtick插入；不擅加128前摇位移门。原1/3秒/g-630抛物线、每tick切线方向、asymmetrical左向sticky flipY、6距离隐藏；结束strict22接触/原可用ranged dodge后ceilfrandom4..7，下一tick提交原physical2。正常甲由既有hurtDefender处理；无火DOT/假主英雄XP。目标死亡仍可insert无伤箭，目标移除拒insert；已释放刀失配则原地面2.1秒淡出/一次随机角度，water格改用原splash。hitFX使用原offset/z/帧。额外blood/pop/完整原音频/队列IDs、原路径和目标优先仍适配或欠，非全部敌人/原版同输入1:1。

新模块web/stages/satyr.mjs只由内部stage7 loader动态加载。World新增可选spawn/enemy/holdsMelee/shot钩子，Renderer可选drawShot钩子；旧1–6没有stageRuntime，不加新状态/算法随机。没有新的PNG或RGBA变化，沿用4623帧6,314,902B组；source stage7.json固定原controllers SHA并记录安全stub继承、源码范围与新模块SHA。read_satyr_rules只读取arrow prototype两条decal tween keys，不执行controller；grid为原level07_grid声明。

620项Node通过（9新测试），实际build satyr-browser-final以真Space/World.cast援军后自动掷刀，原150HP羊人未被改伤害值，援军40→35→28、gold850不变。原Canvas飞刀q/alpha/负行列式左向翻转/旋转与body帧、循环安全完整World绘制快照不变、无missing/unready、桌面pause/wheel/844×390CDP touch/退图访问/星/XP/挑战progress保持通过（真实首波先生成骚扰者时允许且只允许原已发现通知记录）。桌面与手机active图已人工看。是受控原路节点/队列/时钟fixture，非自然7或原版同输入同步。普通敌/原faerie_trails暂存导航、hoplite召唤、蛛网、Druid/允许高级塔、通知/书页/自然三模式/自身预算/发布链仍欠，不称21模式。

初纯测左向刀仅走1tick还处于原6距离隐藏区，改5tick可见采样；后护甲断言错用浮点而现原路径是round，改断言，不改产品甲。额外显式done guard确保同一刀不会重复提交。首旧九模式命令漏TEST_URL访问8765被拒，不算通过；最终指向actualbuild8766重跑。专项一次first-wave真实骚扰者发现记录使全progress等值断言失败，修fixture只允许该原seenNotifications记录，其他完整字段仍逐一等值；未改产品持久化。此前一轮只调查未发布，本批才有实际运行链，不倒填版本/通过声明。

最终已发布冷100ms/1.5MBps/cacheoff：旧14,857,633B/240req总16.093s；第四14,815,011B/230req书7.182s/总16.997；第五14,998,319B/241req书7.842/总17.719；第六14,938,990B/240req书8.146/总23.724。全部正常exit0，不保所有线路；第五只余1681B，后续不可全局静态加载新关大代码/声明。第六boss/cart后期额外3.87MB仍为真实下载，不称整局<15MB。原九模式/手机存档、连续新档4/5/6自然链和UI均正常exit0；4战役19命/英雄142/铁95，5战役20命/英雄201/铁147/XP37600，6战役20命零漏/真实boss收尾→英雄120/铁169/XP47121，旧计划没改。公开一次manifest确认.141/UI正常exit0，新推送不轮询CI。

第7隔离冷入口本批 **16,861,260B/231req**、book7.413s/总17.560s，15MB assert正常exit1，base/progress/draw无变化、无missing/unready。仍未过预算，入口继续关闭；不抬门槛/降质/清alpha0RGB/漏必需图，也不冒已发布旗7书7路径。

最终actualbuild1679文件104,604,279B含manifest，web运行模块及新stage7数据逐字节等build，oldcompact1314帧2,122,316B保持；原4/5/6图不变。主要logs artifacts/satyr-tests-publish/build-publish/source-pinned/groups/browser-publish-repeat/pumpkin-publish/old-nine-publish/ui-publish/natural4/natural5/natural6/performance/stage4-performance/stage5-performance/stage6-performance/stage7-budget/pages-ui.log。早期失败均保留，正常exit0和预期预算失败分开记录。

## 0.2.141：石环阵毒南瓜基础链

正式可玩仍为前六关18模式，`PLAYABLE_STAGE_COUNT=6`。第7关只允许内部隔离加载，生产 Repository、地图、奖励和存档边界没有放开。其余第7关机制、自然三模式、通知/百科/旗路/书页及发布验收尚未完成，不称21模式。

原APK没有独立的 `level07.lua`。本关声明是 `level07_data/paths/waves`，实体控制器在 `kr3/game_scripts.lua` 与共享 `all/scripts.lua`。原中文关名从APK字符串表读取为“石环阵”。指定视频的第7关战役为 BV1y8411R7iB P20 / CID1232909071；125秒帧已人工查看。P21/P22为英雄/钢铁挑战。视频英雄、经济与输入不同，仅作同关参考，不是同步像素验收；来源记录在 `tools/sources/stage7-video.json`。

### 已实现

- 原三株 `plant_poison_pumpkin`，位置(335,243)/(859,536)/(471,685)。开波且未封锁后重新计25秒恢复，原25帧ready后进入可点击状态；wave0不能偷用。点击不要求已有敌人，空放也消耗。shoot29帧结束后开始下一轮恢复；已经开始的释放不被中途封锁打断。
- 原9/15/17帧三组烟雾；第17帧查询当前位置170/.7椭圆内合法目标，使用原 `vis_flags=1048578`，没有凭感觉加地面目标限制。减速与中毒分别排队，下一模拟tick插入，毒伤再次排队提交，不借主英雄XP。
- 原slow factor .5、duration4，乘当前速度、结束除回自身倍率；同名刷新时间不叠减速。死亡/移除只释放自己的modifier，不清Arcane/Blade/外部眩晕计数。当前是这两种固定level1 modifier的职责适配，不冒通用多等级引擎。
- `scripts.mod_dps` 原每.1秒一个整数随机2..2，固定范围也消耗随机；首周期立即产生，4秒共40次。原32800是 `DAMAGE_POISON32 | DAMAGE_MODIFIER32768`，不是NO_SHIELD_HIT。按目标毒抗、health damage_factor与原floor处理，不误用物甲/魔甲，不加最小1假伤害；可以击杀并发一次原金币奖励。ignore_damage/immune_to仍生效。
- 头标使用原poison_violet small/medium/big动画及unit.mod_offset、目标z；原三处idle粒子与12处烟雾按source anchor/trim/alpha/tween、两轴翻转绘制，fill镜像offset单独处理。原click_rect(-30,-5,60,54)按当前相机缩放定位真实按钮，桌面和手机触摸均走 `World.activatePlant`。原声音、ready通知图标与成就播放仍未接，未虚构声音已还原。

### 按需资源与边界

`web/stages/stage7.mjs` / `pumpkin.mjs` 置于子目录，只在显式内部加载第7关时动态import。build复制并检查子目录模块，但不会把它们加入顶层modulepreload。大声明/图只在 `assets/stage7`，旧前六关不请求此组。

World只新增可选 `data.stageRuntime` 的init/step/activatePlant接口，Renderer对应只读drawPlant/draw接口。只有stage7 loader提供该对象；旧World不产生pumpkin state/字段/RNG。对象状态全在World，无timer或跨场景缓存。真正关卡入场仍须完整decode并通过既有owner/current guard。

`extract_stage7.py`读取原声明、对controllers只做-bl与prototype常量检查，`read_pumpkin_functions.lua`使用声明stub定位真实继承：plant为game_scripts.plant_poison_pumpkin，poison为scripts.mod_dps，slow为scripts.mod_slow+mod_track_target。不执行controllers、不移植mixed mod。源码、PNG/声明SHA固定，4623逻辑帧/6,314,902B独立组，逐RGBA/size/trim无损；当前含保守共用依赖，不声称已是最小资源闭包。原4/5/6三图逐字节不变，旧compact仍1314帧/2,122,316B。

第7隔离冷入口实测 **16,852,393B/230req**，book7.419秒/总17.573秒，15MB断言正常exit1。base catalog/进度/draw快照不变，无missing或未decode实际调用；不是正式flag7/book7路径。预算没有通过，不抬门槛、降质或删当前必需图，入口继续关闭。

### 验证

611项Node全过（10个新增pumpkin测试）。实际build的pumpkin-browser-publish真实Space开波、25秒准备、真实空放、对原130HP剑蜘蛛释放，原40次毒伤经.5毒抗后HP130→90，速度51→25.5→51，850金币不变；原Canvas q/alpha/flipY/队列矩阵、完整循环安全World快照、无missing/unready、真实暂停、844×390 CDP触摸南瓜与暂停、退图清理均正常exit0。桌面/手机图已人工看。样本有受控队列和目标位置，非天然第7通关或原版同输入帧。

初包真实Canvas发现DefenseFlag与poison_violet有metadata但未decode：不能因它们在go_towers中就整类跳过。实际按已有tower专用组的frame清单排除，只把未提供的完整依赖纳入新组，修后绿；未吞missing。纯测17/30浮点边界改下一原frame采样，不改产品阈值。首次browser从title直接隔离后退图，正常mapInitialized/upgrades归一化被fixture误判；改先真实title/save/map初始化再比较完整进度，产品不改迁就fixture。

原天然九模式/存档手机、连续新档4/5/6自然链与UI/public UI通过。4campaign19命三星/heroic142/iron95；5campaign20命/heroic201/iron147/XP37600；6campaign20命零漏/真实首领收尾→heroic120/iron169/末XP47121。所有当前运行模块与stage7资源逐字节等最终build。

最终cold100ms/1.5MBps/cacheoff：旧14,856,512B/240req，总16.155s；4真实旗书14,813,890B/230req，book7.213s/总17.122s；5真实旗书14,997,198B/241req，book7.850s/总17.743s；6真实旗书14,937,868B/240req，book8.154s/总23.729s，均exit0。不保所有线路。**第五仅余2802B**，后续第7大数据/模块必须继续按关加载，不能全局静态导入。第6boss/cart事件仍另实际下载约3.87MB，不冒整局总流量<15MB。

## 下一步

下一批优先补原faerie_trails暂存导航机关或蜘蛛原蛛网特殊链。hoplite召唤/计数组.143与satyr两次掷刀.142均已闭合，不再当作尚未接的generic ranged。其余新敌导入声明/图和通用运动仍不等于专有AI完成。webspitting spider专用蛛网、原允许的Druid等高级塔分支、ready/敌人通知与百科、成就/声音、自然三模式、预算及真正发布链也未全。

第7关充分验收后才扩cap、原旗路、书页与奖励存档。不要继续无限磨已完毒南瓜/旧HUD/4–6固定策略，也不要只因资源存在就开放7。整体原grid、native队列/IDs/global z、旧箭物理、Arivan、安全区、特殊death、血池、完整音频与宝石天赋仍有差异，不称整体1:1。

最终交付构建1678文件104,578,733B（含manifest）；runtime main a1b2ea6、Pages b9f03f4均推送。私有Site source74007759bb6e0a11a3274e0624765f6626ff87d0，deploy appgdep_6aee318f07608191bc8949fa5d76d4e8 succeeded，owner-only保持。公开站本轮一次manifest确认0.2.140/public UI正常exit0，新推送不轮询CI。Sites技能位置已更新为1.1.4，旧1.1.3不存在；helper/native各一次成功，无重复部署。

主要日志：artifacts/pumpkin-tests-publish.log、pumpkin-build-publish.log、pumpkin-browser-publish.log、pumpkin-source-pinned.log、pumpkin-groups.log、pumpkin-natural.log、pumpkin-old-nine.log、pumpkin-ui.log、pumpkin-pages-ui.log，以及pumpkin-performance.log/stage4-performance/stage5-performance/stage6-performance/stage7-budget。第7预算是正常exit1，其他最终专项均正常exit0。HTTP29429比daemon88207后精确TERM，owned server正常收143，所有结果收齐无后台。
