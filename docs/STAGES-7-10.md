# 第7–10关还原工作区

## 0.2.147：德鲁伊Sylvan三级购买、诅咒与生命损失传播（隔离验证）

`web/stages/sylvan.mjs`只由第7动态runtime加载。250每档/max3，独立s.druid.powers，塔与技能合spent1790/战斗退1074；nature仍disabled，不假生成熊。World与TowerMenu只补最小可选powerOffer/buyPower接口，旧1–6无Sylvan状态/额外随机。原tower_druid1107外循环在未blocked且普通load/shoot结束后观察changed，queue独立druid_shooter_sylvan；下一tick初始化15秒strict冷却，升级不重置旧shooter时钟。失败沿SU.delay_attack276–279重设为now-cd+1-1e-6。原1235–1268/1248闭包完整只读：owner blocked/can_do_magic门、range175/flags6、排除ogre_magi/已诅咒；原utils714–738只filter并保持实体迭代顺序，不擅自改成最前优先，保留原节点有效性门。捕获首目标后20/30释放，释放读当前rank，不新加range/vis门；已开y_wait不被blocked或magic改变假中断。原46帧cast尾帧等同idle，独立施法不占普通三石攻击。

原mod_druid_sylvan15052–15114以当前HP为基准，逐tick观察净下降；下降才更新基准并向r100/.7内其他合法敌人逐个queue ray，系数.35/.7/1。正向回血不立即重置基准，致死/移除先退出，不冒即时hurt回调反伤。5秒strict寿命，同级只刷新ts而保留HP基准/动画年龄/rayAt，低级拒/高级替换；卖塔只移shooter，已插入curse继续。faerie运输调用自己的清理，原对象重插不复活旧curse。native实体顺序/通用modifier/队列IDs及协程仍适配，不称完整通用引擎。

ray_druid_sylvan通过game_scripts共享表继承原scripts.ray_simple3242–3353，无KR3 override。该模板没有track_target，所以不套Wild射线的64位移追踪门，from/to固定；前摇F_RANGED粘性失追，5/30后ceilfrandom同值仍抽一次随机，再queue type1真伤和level0 affected标记，下tick提交，护甲不再扣第二次。health ignore/immune门、原一次金币/无假主英雄XP保持。ray_cooldown仅管显示：elapsed<.5的射线隐藏但仍伤害，strict>.5才更新rayAt；不是伤害节流。affected为原generic mod_track_target4240–4300、.6秒/原size_names与mod_offset，独立寿命。原curse地贴z1400/1秒scale1→.9→1，第二层才用unit.mod_offset；12帧ray/image_width42/x独立缩放、y1/anchor(0,.5)/z3400，入同actorqueue纯绘制。专属声音/完整native排序、modifier组合和额外FX仍欠或适配，非全塔1:1。

extract_druid扩安全声明stub与完整-bl审计，固定10原源码SHA/历史PNG和atlas pin不放宽，controllers不执行。Druid从178帧479156B到317帧730942B，新增原shooter/curse/ray/affected完整动画，逐RGBA/size/trim无损。只第7读metadata、三级菜单/交易前decode，旧compact1314帧2122316B、4/5/6及原7图字节保持；UI仍627图。全量extract_campaign调用已在，最终runtime/资源逐字节等actualbuild1689files105493563B。

668Node全过（10新）。actualbuild sylvan-browser-publish真菜单升级由14个原ettin死亡各70付款，总1790后40gold；三级/满级拒付/nature锁正确。真Space开波、绑定原World.step避免RAF双钟，受控原road4/lane1/node57及两邻lane自动施法，三石对诅咒目标实扣40+47+37=124HP，源mod观察124净下降后向两邻敌排队射线，各实际124真伤，affected真实存在；没直接设置HP/gold/seed/cd/施法状态。原Canvas q/alpha/x独立拉伸与旋转矩阵、循环安全完整World快照不变/无missing-unready，pause/wheel/844×390CDP touch、真卖塔退1074至1114且curse保留、地图progress严格保持（仅合法ettin发现记录）全过。桌面/手机已人工看，是隔离fixture非天然7或原版pixelcert。

初版核utils后发现不该排序与遗漏节点门，已实修产品、重提/重build/重跑668及最终专项，不拿初包冒最终。新增隐藏射线伤害纯测曾用稀疏跳时钟却期望下一frame第二射线已完成，改按原frame推进观察，没给产品加epsilon。早期本地UI runner漏TEST_URL导致8765拒连，最终明确8766通过。最终原完整天然九模式/手机存档/UI exit0，Druid基础/faerie实际专项也过；连续新档4/5/6自然仍4campaign19命/heroic142/iron95，5campaign20/heroic201/iron147/XP37600，6campaign20命0漏/764kill772spawn、真bossdeath-complete父complete→heroic120→iron169/XP47121真实奖励，旧合法策略没改。

最终cold100ms/1.5MBps/cacheoff：旧14858212B/240req总15.989s；4真实旗书14815590B/230req书7.166总16.999；5真实旗书14998891B/241req书7.795总17.620；6真实旗书14939563B/240req书8.101总23.635，全exit0，不保所有线路。第五仅余1109B，后续大声明/代码仍须按关leaf lazy。7隔离16960066B/237req书7.581总17.793，15MB assert明确exit1，无base/progress/draw变更、无missing-unready；非正式旗7/书7路径，不抬门槛/降质/清alpha0RGB/漏必需图。原6boss/cart后期仍另3.87MB，不冒整局15MB。正式cap6/前六18模式，第7closed；下一步nature召熊及第7必要验收，不再重做Sylvan或三石。

本轮公开单次manifest遭TLS EOF、public UI遭ERR_CONNECTION_CLOSED正常exit1，未循环重试或冒通过。私有Sites get_site/新credential连续连接失败，本轮无helper或native保存/部署，不能冒私有已同步；最后已知私有仍是.146的成功源ae8ff5817708ed72772cdba2e785754f537c337c，权限未改。主要logs artifacts/sylvan-{source-final,tests-publish,build-publish,browser-publish,old-nine-publish,ui-publish,natural4,natural5,natural6,base-regression,faerie-regression,performance-publish,stage4-performance-publish,stage5-performance-publish,stage6-performance-publish,stage7-budget-publish,pages-ui}.log。

## 0.2.146：德鲁伊塔升级、三石储存与普通齐射（隔离验证）

`web/stages/druid.mjs`只由第7关动态runtime加载，四基础TYPES不变。原7三mode锁表复核后，artillery4映射tower_druid；campaign/heroic允许Wild/Arcane/Blade/Druid，iron仍禁止新建mage/barrack，不顺手解锁旧4–6的Druid或旧4/5的Wild。真实125→220→320→375，总spent1040，开波后退款624；action_arg拒entwood。原nature/sylvan尚未完成，菜单和World拒买，不假生成熊或提供无功能集结。

原game_scripts1107–1230及1121–1142/1171–1174闭包完整只读-bl：strict1.4秒后查当前椭圆目标，预测点不能落FAERIE；无敌时连续储存最多3石。load第16帧queue创建石头、等28帧完整施法；无储存时先load再直接射当前目标，不重等冷却。shoot22帧，第9帧重找前方目标、没有新目标沿原引用回退；预测点在1.05range才发出并清储存。第一颗落目标子路预测点，第二颗lane1同node，第三颗lane1向前偏5node，原is_node_valid失败回退。range190；已开load/shoot不因blocked中途冻结，outer loop才检查。预测以当前motionVelocity长度、原average_node_dist6/ceil和World实际route节点适配，不冒native预测/协程同输入认证。

原rock_druid13836–13869与shared bomb2157–2299/2196闭包：load13帧→travel1帧→原0/2/0浮动，持有z3000/sort_y_offset-72；目标赋值后launch FX、z3400、去sort offset、按35/30秒/g-900抛物线，右射负旋转、左射正旋转，8距离隐藏。原bomb在elapsed+dt>=flight_time处理落点，不假强制snap。半径50/.7椭圆，按原utils141–157极角半径比例衰减，floor(50-20*factor)再ceil乘伤害系数，不抽伤害随机；下一tick提交type8半物甲真实伤害，health ignore/immune先门。源完整native queueIDs/目标排序/粒子/pop/blood/声音与高阶全局天赋仍适配或欠，非全塔1:1。卖塔只删未发石，已经释放的继续飞行。已TRAINABLE两石系天赋按原TDUP81/83目标名单给实例bullet生效，不写回模板。

原安全声明stub确认tower_druid.info.fn为scripts.tower_common.get_info，不能因模板有barrack字段把底栏误画熊生命。原portrait12从APK PNG exact裁图，UI627图；两技能未实现不假解锁。独立Druid组178帧479156B，逐RGBA/size/trim无损，只第7读取metadata、三级塔菜单/交易前完整decode，复用owner/scene/slot/version守卫。source tools/sources/druid.json固定10原源码SHA、原atlas/PNG及肖像PNG SHA，controllers不执行；完整extract_campaign已有调用。旧compact1314帧2122316B、stage4/5/6图及stage7原4679帧6369762B/map847936B均保持。

658Node全部通过（8新）。actualbuild druid-browser-visible：真title/save/map后隔离7，真实三只原ettin死亡各70收益付款，最后20gold/spent1040；原图请求abort不升级扣费→retry、hold后Escape不回填菜单均过。真Space开波，绑定原World.step避免宿主双钟，受控原road4/lane1/node57自动三石储存/齐射，对原900HP ettin真实raw44/37/35/39/48(type8)，随后源回血仍保持，没改HP/gold/seed/cd。原Canvas q/alpha/旋转矩阵/8个Druid包draw调用、循环安全完整World快照不变/无missing-unready；真pause/wheel/844×390CDP touch/地图清理全过，桌面/手机已人工看。隔离fixture不是天然第7或原版pixelcert。首次纯测缺旧关场景模板、选错原路、浮点ceil期望与循环快照均修fixture；首次browser只漏计合法enemy_ettin发现存档，改为仅允许此一条记录、其他进度严格相等后通过。网络失败toast等真实3300ms自动消失后重拍，没有清除产品错误冒无错截图。

原完整九模式/手机存档、蜘蛛/faerie专项、UI/public UI正常exit0。连续新档4/5/6自然仍4campaign19命/heroic142/iron95，5campaign20/heroic201/iron147/XP37600，6campaign20命0漏/764kill772spawn且真bossdeath-complete父complete→heroic120→iron169/末XP47121真实奖励，旧合法策略未改。最终已发布冷入口100ms/1.5MBps/cacheoff：旧14858565B/240req，总15.968s；4真实旗书14815943B/230req，书7.180s总16.997s；5真实旗书14999246B/241req，书7.804s总17.624s；6真实旗书14939918B/240req，书8.106s总23.648s，全exit0，不保所有线路。第五仅余754B，后续大代码/声明必须继续子目录按关lazy。

第7隔离冷入口16951383B/236req，书7.466s总17.645s，15MB assert明确exit1，无missing/unready/base/progress/draw变动；不抬预算、降质、清alpha0RGB、漏必需图，也不冒正式旗7/书7路径或整局15MB。Druid两技能、Ready/敌通知百科/完整音频、第7自然三模式/自身预算/原旗路书奖励cap7仍欠。正式cap6/前六18模式、第7closed，整体前10目标in_progress。主要日志artifacts/druid-{source-final,tests-final,build-first,browser-visible,old-nine,web-regression,faerie-regression,ui,natural4,natural5,natural6,performance,stage4-performance,stage5-performance,stage6-performance,stage7-budget,pages-ui}.log。


## 0.2.145：蜘蛛近战后吐网与独立眩晕生命周期（隔离验证）

`web/stages/webspitter.mjs`接原enemy_webspitting_spider9705–9771/ready9709–9718：必须真实普通近战结束后，strict6/6/6/4秒且当前存在合旗标、未眩晕的阻挡单位才起spitWeb；不是远程射弹。原custom没有can_do_magic或chance1检查，不凭“沉默”印象加门。23帧施法，第11/30秒重读当前blockers，flags71303168/未stunned并逐个unit_dodges，再queue mod_spider_web，下tick实际insert。chance0仍消费随机；Blade通用unit_dodges与原custom insert15866–15883第二次parry判定独立，零级不假抽第二次。前摇stun取消，释放后的原animation_wait不凭感觉中断；动画结束再写cd.ts并解除当前目标的阻挡关系。普通melee/路径/协程排程仍沿当前World适配，不冒native逐帧认证。

mod_spider_web.update/remove由game_scripts共享scripts表继承原mod_stun4440–4561，未发现KR3 override。普通3秒/hero2秒，start9帧、loop1帧、end6帧；start内strict>5/30后隐藏目标body/世界血条与Canvas点选，进入end就显形，但自己计数仍等end动画结束才撤。same-level刷新ts不重开display age/叠计数，低级拒绝、高级替换；死亡/移除释放自己token，不清外部stunned/睡眠/Blade计数。无伤害或全局免伤，被包裹仍可实际受伤。普通兵计时冷却继续流逝，未提交攻击取消；已进入原Blade反击/刀舞按现有源phase继续，不假打断。新闪避/伤害回调与英雄nimble检查尊重spiderWebCount，不在bound时抽随机假闪。普通英雄技能/所有原modifier隐藏、nativequeueIDs/全阵营组合仍适配或欠，非通用完整modifier引擎。

World只补可选meleeStarted/defender接口，Renderer可选hidden与Campaign隐藏hero Canvas命中门；只有stage7动态runtime实际提供，旧1–6无新增state/RNG。faerie同对象重插也重启蜘蛛controller时钟。原render custom_scales默认.55、anchor(0.5,1/7)、原flip/z/完整start-loop-end纯绘制。原mod声明/16帧已有stage7组中，本批没有新PNG或RGBA更动：4679帧6,369,762B/map847,936B、旧4/5/6图与oldcompact1314帧2,122,316B均保持。extract_stage7/read_webspitter_functions用声明stub与-bl完整核源/固定SHA，controllers不执行，不导mixed补丁。

最终650Node通过（11新）。actualbuild webspitter-browser-publish真Space后受控原road0/lane1/node20，World原步长先行5秒再真实cast援军node80；蜘蛛原550maxHP/实际548HP、gold850未写作弊值。自动近战实扣援军40→29，再自然施法/queue包裹3秒→隐藏→显形时仍count1→end后count0，实际hurt1再降28证明并非免伤；原Canvas q/alpha/.55尺寸/矩阵/body确实不画、draw完整循环安全World快照不变/无missing-unready、真pause/844×390CDP touch/地图完整progress保持均通过。桌面/手机图人工看；是受控路径/队列/宿主RAF单时钟fixture，不是天然7或原版同输入pixelcert。

早期pure把Blade当限时援军home=null创建，因该模板没有reinforcement.duration而抛错；改用原兵营身份home0并加载Blade声明后通过，未改产品unit模板。首全量测试保留该fixture失败，随后修正后的650与最终actualbuild才算通过，未拿早期.144构建冒.145。首次只用英雄的CPU探针没形成持续blocker，保留源普通World英雄/道路规则，改合法援军延后接敌，不改通用35range/HP/cd来迁就测试。第一次与最终浏览器专项均正常exit0。

正式仍cap6/前六关18模式，第7closed。Druid/原高级塔与mode锁、Wild在7实际允许范围、Ready/敌通知百科/完整音频、自然三模式/自身预算/原旗路书奖励cap7待验。原native网格/队列IDs/globalz/旧箭/安全区/Arivan/特殊death/血池/全音频/宝石天赋仍欠，整体非1:1。



最终actualbuild1682files104690197B含manifest，全部运行mjs/新声明与build逐字节一致，source pinned重提通过。650Node、webspitter-browser-publish、faerie-regression、原完整天然九模式/存档手机old-nine-publish、最终UI均exit0；连续新档4/5/6 CPU自然链仍4campaign19命/heroic142/iron95，5campaign20命/heroic201/iron147/XP37600，6campaign20命0漏/764kill772spawn/真boss death-complete父complete→heroic120→iron169/XP47121真实奖励。

最终cold100ms/1.5MBps/cacheoff：旧14,858,034B/240req总16.948s，4真实旗书14,815,412/230req书7.199总17.039，5真实旗书14,998,715/241req书7.828总17.721，6真实旗书14,939,386/240req书8.122总23.664，均exit0，不保所有线路；第五只余1285B，大code/data仍必须web/stages按关lazy。第7隔离16,937,541B/234req，15MB assert明确exit1，base/progress/draw不变且无missing/unready，不冒预算通过/正式旗7书7/天然通关。第6boss/cart后期另真实下载3.87MB，不冒整局流量15MB。公开manifest本轮单次确认.143，public UI正常exit0，不轮询新推送。

主要logs artifacts/webspitter-source-publish/groups-publish/tests-publish/build-publish/browser-publish/faerie-regression/old-nine-publish/ui-publish/natural4/natural5/natural6/performance-publish/stage4-performance-publish/stage5-performance-publish/stage6-performance-publish/stage7-budget-publish/pages-ui.log。初pure Blade home=null fixture失败保留；最后仅budget scope文本去掉已完spider旧描述，独立stage7-budget-final明确正常exit1且仍为16,937,541B超15MB，不放宽门槛。

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
