# 数据库记录（一律追加写入，禁止覆盖已有内容）

按执行顺序追加 SQL 语句（含测试数据的 INSERT），仅凭本文件即可在新机器上完整重建数据库。

---

（暂无建表记录，数据库：wzx_web）

## 2026-11-20 建库、建表 wzx_news 并插入测试数据

-- 1. 建库（如不存在）
CREATE DATABASE IF NOT EXISTS wzx_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE wzx_web;

-- 2. 建表 wzx_news（科技新闻表）
CREATE TABLE IF NOT EXISTS wzx_news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL COMMENT '新闻标题',
  summary VARCHAR(500) NOT NULL COMMENT '新闻摘要',
  content TEXT COMMENT '新闻正文',
  source VARCHAR(100) NOT NULL COMMENT '新闻来源',
  publish_time DATETIME NOT NULL COMMENT '发布时间',
  cover_img VARCHAR(500) DEFAULT NULL COMMENT '封面图地址',
  INDEX idx_publish_time (publish_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='科技新闻表';

-- 3. 插入 10 条科技新闻测试数据（在 wzx_web 库中执行）
INSERT INTO wzx_news (title, summary, content, source, publish_time, cover_img) VALUES
('国产超大规模模型开源，推理成本再降一个数量级', '国内科研团队发布新一代开源大模型，参数规模达万亿级，通过混合专家架构将推理成本降低约十倍，已同步开放权重与训练细节。', '11月19日，国内某科研团队正式开源新一代超大规模语言模型。该模型采用混合专家（MoE）架构，总参数量突破万亿，在数学推理、代码生成与多语言理解等基准测试中取得领先成绩。团队同时公布了完整的训练细节与评测脚本，并宣布推理成本较上一代下降约十倍，开发者可免费商用。业内认为，此举将进一步降低大模型应用门槛，加速行业落地。', '科技日报', '2026-11-19 09:30:00', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=futuristic%20AI%20neural%20network%20glowing%20blue%20chip%2C%20tech%20news%20cover%2C%20professional%20photography&image_size=landscape_16_9'),
('我国商业运载火箭成功实施一箭多星发射', '某商业航天公司的新型运载火箭完成首次一箭六星发射任务，六颗卫星全部精准入轨，标志着我国商业航天发射能力再上新台阶。', '昨日上午，我国某商业航天公司自主研发的新型液体运载火箭在酒泉卫星发射中心点火升空，以一箭六星方式将六颗小卫星送入预定轨道。这是该型号火箭的首次多星组网发射，卫星将服务于低轨物联网与遥感数据采集。公司表示，下一阶段将开展火箭回收试验，力争实现重复使用。', '新华网', '2026-11-18 16:20:00', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=rocket%20launch%20at%20dawn%2C%20flames%20and%20smoke%2C%20space%20technology%20news%20cover%2C%20cinematic&image_size=landscape_16_9'),
('全球首款2nm制程手机芯片亮相', '国际芯片巨头发布全球首款采用2纳米制程的移动处理器，晶体管密度提升30%，能耗降低25%，首批旗舰机型将于明年上市。', '在今日举行的芯片技术峰会上，国际芯片巨头展示了全球首款基于2纳米GAA制程的移动处理器。官方数据显示，相较上一代3纳米产品，新芯片晶体管密度提升约30%，同等性能下能耗降低25%。多家手机厂商已宣布首批搭载计划，量产机型预计于明年上半年发布。', '36氪', '2026-11-17 11:05:00', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=macro%20closeup%20of%20advanced%20semiconductor%20chip%20on%20circuit%20board%2C%20blue%20lighting%2C%20tech%20news%20cover&image_size=landscape_16_9'),
('量子计算原型机实现千万量子比特级纠错', '科研团队在超导量子计算领域取得突破，新型纠错方案将逻辑量子比特错误率降低至实用门槛以下，向通用量子计算迈出关键一步。', '国内科研团队日前宣布，其超导量子计算原型机在纠错技术上取得关键突破：通过动态解耦与表面码联合方案，逻辑量子比特的错误率首次降至实用化门槛以下，并完成千次连续运行验证。论文已发表于国际权威期刊。研究人员表示，下一步将扩展物理量子比特规模，推进专用量子模拟器研发。', '科技日报', '2026-11-16 14:40:00', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=quantum%20computer%20golden%20cryostat%20in%20laboratory%2C%20futuristic%20science%20news%20cover%2C%20professional%20photo&image_size=landscape_16_9'),
('全固态电池量产中试线投产，续航有望突破1500公里', '某新能源企业宣布全固态电池量产中试线正式投产，能量密度较现有液态锂电池提升一倍以上，预计两年内实现整车搭载。', '位于合肥的全固态电池量产中试线本周正式投产。该产线采用硫化物电解质路线，电芯能量密度达500Wh/kg，是当前主流液态锂电池的两倍以上。企业负责人透露，配套的整车测试已完成冬季高寒标定，搭载车型续航有望突破1500公里，计划2028年实现规模化装车。', '澎湃新闻', '2026-11-15 10:15:00', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=electric%20car%20battery%20cells%20production%20line%2C%20modern%20factory%2C%20technology%20news%20cover%2C%20photorealistic&image_size=landscape_16_9'),
('人形机器人完成机场全天候真实运营测试', '某机器人公司的人形服务机器人在国际机场完成为期一个月的全天候运营测试，累计服务旅客超5万人次，故障率低于1%。', '本周，某机器人公司宣布其人形服务机器人已在某国际机场完成为期30天的全天候真实运营测试。机器人在值机引导、行李搬运、多语言问询等岗位累计服务旅客超过5万人次，平均故障率低于1%。公司表示，下一代产品将重点提升灵巧手操作精度，并计划在更多交通枢纽部署。', '界面新闻', '2026-11-14 18:00:00', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=humanoid%20service%20robot%20in%20modern%20airport%20terminal%2C%20assisting%20travelers%2C%20tech%20news%20photography&image_size=landscape_16_9'),
('6G试验网完成外场验证，峰值速率达1Tbps', '多所高校与企业联合建设的6G试验网完成外场测试，实测峰值速率突破1Tbps，时延低至0.1毫秒，标准制定进入冲刺阶段。', '由国内多所高校与通信企业联合建设的6G太赫兹试验网本周完成外场验证。测试显示，在3公里视距范围内，系统实测峰值下载速率突破1Tbps，端到端时延低至0.1毫秒。项目组介绍，相关成果已提交国际电信联盟，6G标准制定预计于2027年前后冻结。', '人民邮电报', '2026-11-13 09:00:00', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=6g%20communication%20tower%20with%20holographic%20signal%20waves%2C%20futuristic%20city%2C%20tech%20news%20cover&image_size=landscape_16_9'),
('AI辅助药物研发再获突破：新分子进入二期临床', '利用生成式AI设计的全新小分子药物正式进入二期临床试验，研发周期从传统的四到六年缩短至十八个月。', '某生物医药企业宣布，由其AI药物研发平台设计的小分子抗纤维化药物已获批进入二期临床试验。该分子从立项到进入临床仅用时十八个月，远低于行业平均的四到六年。平台通过生成式模型与分子动力学模拟联合筛选，将候选化合物命中率提升了约五倍。', '财新网', '2026-11-12 15:30:00', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=scientific%20laboratory%20with%20AI%20drug%20molecule%20hologram%2C%20blue%20tones%2C%20medical%20technology%20news%20cover&image_size=landscape_16_9'),
('国产操作系统装机量突破十亿，生态适配加速', '国产桌面与移动操作系统累计装机量突破十亿台，主流应用适配率超过95%，政务与教育市场占有率持续提升。', '国产操作系统生态大会本周公布数据：国产桌面及移动操作系统累计装机量已突破十亿台，主流办公、社交与音视频应用适配率达到95%以上。相关负责人表示，明年将重点推进工业软件与专业设计软件的原生适配，并设立十亿元级开发者激励基金。', '中国电子报', '2026-11-11 11:45:00', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=desktop%20computer%20with%20abstract%20operating%20system%20interface%20glowing%2C%20technology%20news%20cover%2C%20clean%20modern&image_size=landscape_16_9'),
('深海载人潜水器完成万米级科考返航', '国产载人潜水器完成万米深渊科考任务顺利返航，带回超200份深渊生物与地质样本，多项观测数据为国际首次获取。', '历时52天，国产载人潜水器搭载科考船于本周返航，完成了马里亚纳海沟万米级深渊科考任务。本航次累计下潜23次，采集深渊生物、沉积物与岩石样本超过200份，并首次在国际上获取了万米深处连续72小时的环境观测数据，为深渊生命起源研究提供关键支撑。', '央视新闻', '2026-11-10 17:10:00', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=deep%20sea%20submersible%20descending%20in%20dark%20ocean%20with%20bioluminescent%20creatures%2C%20science%20news%20cover&image_size=landscape_16_9');

