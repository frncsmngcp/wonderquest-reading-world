const CACHE_VERSION = "wonderquest-reading-world-pwa-v1.5.24-persistent-update-75";
const CORE_CACHE = CACHE_VERSION + "-core";
// This cache deliberately keeps the same name between releases. Reading World
// uses content-hashed filenames under /assets/, so unchanged library files can
// survive an app update instead of being downloaded again.
const ASSET_CACHE = "teacher-francis-reading-world-library-assets-v1";
const TUTORIAL_CACHE = "wonderquest-reading-world-install-tutorials-v1";
const CORE = ["./","./index.html","./manifest.webmanifest","./offline.html","./shared/pwa-compat.js","./shared/pwa-register.js","./shared/wq-scrollbars.css","./icons/icon-192.png","./icons/icon-512.png","./icons/apple-touch-icon.png","./shared/startup-prompt-approved.png","./shared/install-assistant.js","./shared/reading-world-analytics.js","./assets/d6f963bddedd6b61549a.ttf","./shared/wq-preload-manifest.js","./shared/wq-asset-preload.js"];
const OFFLINE_INVENTORY = ["./assets/wq-compilation-home-by-teacher-francis-v3.png","./assets/wq-about-developer-panel-v1.png","./assets/wq-card-01-awad-v2.png","./assets/wq-card-02-basa-tayo-v2.png","./assets/wq-card-03-kuwento-tayo-v2.png","./assets/wq-card-04-fluency-pyramid-v2.png","./assets/wq-card-05-basa-bata-basa-v2.png","./assets/wq-card-06-letter-slide-v2.png","./assets/6806525f87e3fb199b29.wav","./assets/5f0394d784f7895d1c08.wav","./assets/3e8b5202503bf390973a.wav","./assets/0f29196a3ff1851f30a4.webp","./assets/deb6439e38c574145459.wav","./assets/fcef2acc9a773ac628ca.webp","./assets/66d5e6b2a0423578c2c9.webp","./assets/85b101e9a15e667434be.webp","./assets/bc6b257b8d74b64528e3.webp","./assets/459e62e51c95db058893.webp","./assets/54e8427761753f46daf4.wav","./assets/9ce2f38b9715ca082967.webp","./assets/096e82b156f50e969f8f.webp","./assets/91d59155ca17e4a083f6.webp","./assets/52aa55ded68edc01905a.wav","./assets/97f2fb3493a49ecbd933.webp","./assets/37bc59310acbd4178b33.png","./assets/4ae4216da6299e1738da.wav","./assets/ad01c92f8bc433643afb.webp","./assets/98d63bfea42692ff4ec2.png","./assets/6f90beeab863fd679a68.webp","./assets/ea3bd04e11c69e1a9c66.wav","./assets/eb073ae6a2851c329579.webp","./assets/31aa952a6f494fe721cb.webp","./assets/604171418f734de40c59.webp","./assets/4270aef95257979c634f.webp","./assets/c8c5a4796729b045f8e8.wav","./assets/9399e37dcb5185db8dc0.wav","./assets/637fd932ebc71d841ac2.wav","./assets/823521a18f0ab0ab31bc.webp","./assets/e1bf8393b231410ea701.wav","./assets/9730601d0baccb61bbf5.webp","./assets/7c4e92506eb2d7d008c8.wav","./assets/1a0a1781b3f55790dc48.wav","./assets/de2725ff752b1cdf553e.webp","./assets/fdd94a73f8640858ef73.wav","./assets/2cef6380dc6d26f108cd.wav","./assets/713e03da4c46e817271a.webp","./assets/78bc537343f7dd96f6d6.wav","./assets/f1851e4c3db1183b62a1.wav","./assets/b2a9a23223245bc98f50.wav","./assets/05bcd7fee3987bb292cb.webp","./assets/1b7b067802b2813dbbcd.wav","./assets/a680001f2a32b685e297.wav","./assets/ecd8143c83a5f40358be.png","./assets/2b2f26ea9c0650ca099a.wav","./assets/64f809530a889e806604.webp","./assets/07fbc6d3f50e84b940ef.wav","./assets/ae698da8e737cb869e50.webp","./assets/75e9bb7bfe8e053d4d60.wav","./assets/973800a120c188712597.webp","./assets/6eac4ac6aee0c863fdbe.wav","./assets/wq-basa-gameplay-v26.webp","./assets/5bf899910f5eba62d07b.webp","./assets/5e1a0ec95f148cb4a86e.png","./assets/994a0cfcbae1b99d23dc.wav","./assets/e02a2f773c52a1989fa9.webm","./assets/99dff4196d3d159fcaf4.webp","./assets/03c18c2c532aa452fccd.wav","./assets/5e3d382db4dd83d59aa5.png","./assets/b72959e16e88a89e35fc.wav","./assets/1c1202ba996ca83203bc.wav","./assets/2a54a3a93bdad2a045f1.png","./assets/0fbb7646b62ae58b0a6b.webp","./assets/7649405c03574249a06a.wav","./assets/0e4641389f3c0ae993d2.wav","./assets/98219ebff0e63010fe87.wav","./assets/5c5aa8fdc461303ebe92.png","./assets/97b87f9cfcf4b5232f35.wav","./assets/b19d6b1a9f776485b067.webp","./assets/0f64402fb5a2e4b0f574.wav","./assets/6f5e90d1fb113c867d08.wav","./assets/30b51582ce69a797a49c.wav","./assets/938b1e0b2f425342a9f9.wav","./assets/8444ac1ce5abed70b688.wav","./assets/69c0e06d3605f7e2483c.webp","./assets/70de08d3843d504d8af1.wav","./assets/0ee3e0f352e730e650f4.png","./assets/3a4b0cf5057411a2dbd1.wav","./assets/0a84e891d5b24de10d25.wav","./assets/7dd830dc2c9e7804a34b.wav","./assets/b7dddef5721f2338ebd8.png","./assets/d352d548ca1c074d5766.png","./assets/91fabb9dcbc5bd5bfa46.webp","./assets/582630cb1fe390069309.wav","./assets/6caa1a84826ed96f6b6d.webp","./assets/821ef685270e0d82a283.webp","./assets/fbd5fd93237762087a19.png","./assets/cf6802d589ce91ee70f1.webp","./assets/5c3992c221f8737679be.wav","./assets/adfde7c3d02dbaadf385.wav","./assets/bedc6b935e367d2eb20c.wav","./assets/bbafbd09caf3c2a7ee1e.webp","./assets/c087b855c25b8c0aedb4.png","./assets/30a0a310893a414f5bbd.wav","./assets/9361c520dc3f00f484bd.webp","./assets/84841d7e5f45b6a737a8.wav","./assets/44cdcce76b0a595dfa0d.png","./assets/f24a1615ef9b21797485.wav","./assets/d6f963bddedd6b61549a.ttf","./assets/0b7e54570ed9ce1be11c.png","./assets/3af378426e6e40757a17.webp","./assets/8cfa832aad12e5ae95a9.webp","./assets/c9c6577c23367f89352f.webp","./assets/dc70ff74c5177b3f6f27.wav","./assets/86f0e7c6ead453699c71.wav","./assets/f9e4de20562ab15852ba.png","./assets/444fd02a26a6ecee7b4a.wav","./assets/5e397f0effef1e57d8eb.wav","./assets/91c96e84111cf4eda1d2.wav","./assets/0da19d14837a284b5f70.webp","./assets/d97acc7e0547d9a62411.wav","./assets/5db173593080c179efda.png","./assets/wq-letter-slide-home-v51.webp","./assets/deb5891c25b2ca1e608e.wav","./assets/523275d6ea3903db427e.webp","./assets/e2b3898d83bb83b7e679.png","./assets/563f844fc6d316fc5478.webp","./assets/48abd5a8276b967fb8f6.wav","./assets/0c3708328f64d60b40e1.webp","./assets/c5a6f1c18e96a137fc9e.wav","./assets/8b52fe00a2708ce97daa.wav","./assets/96271706d7242774a080.wav","./assets/dcb63305a562db8b73a9.webp","./assets/987db95084de8250d146.wav","./assets/8b4cff75e1cb9c6efca6.png","./assets/f4662c253d97722bf481.wav","./assets/634e7b80e7f2bf0e957c.webp","./assets/cac47f39e4df512f4939.wav","./assets/647a1447b79eb15bc929.png","./assets/e30e8f14d197bf2492ea.wav","./assets/23b7abaff00fae400dde.webp","./assets/0866e669cb7019887033.wav","./assets/9ced74d2a9bf1dcf9bcb.wav","./assets/8b26a8788b77fd7d2946.wav","./assets/734344085663a9cd7c35.webp","./assets/ed2de061a79a87afec4e.wav","./assets/26f2cc6f30ed2f9c8078.wav","./assets/4d6634e2f89f30f86411.webp","./assets/4e116f82f617efb88ab3.wav","./assets/56eb72bfefd0ce9b4534.wav","./assets/1c5e9f7039da5a1feffa.wav","./assets/19d71489c16533516bd5.webp","./assets/e3efafa8cf2576b7f977.wav","./assets/6c6285c130d6ab5d64f4.webp","./assets/61bbf9d9ed6ea2b250a5.wav","./assets/335b66e49a8c8689fb07.webp","./assets/wq-basa-home-v26.webp","./assets/c01ca33c57f016ea64e6.wav","./assets/ca5d04cb80b2b0db8782.webp","./assets/94dee3a9173e970e86e2.wav","./assets/4980860eb17b17d6e2b3.wav","./assets/affe5412a5772a7f2a85.png","./assets/93962936aa084dec63b6.webp","./assets/4b39af8d776cbf5696cc.png","./assets/d4c12db619557011a944.wav","./assets/8d8ef9a028f300cdb003.webp","./assets/c4ce1523bdc3ba691e1e.webp","./assets/b8497650bc3a94c62bc2.webp","./assets/78db2c584d396264aa2b.webp","./assets/9b3bb7897e7102050ccd.webp","./assets/a796fa177e0ff477a6d4.wav","./assets/8950917c86d282fafa04.webp","./assets/04dfc8e1a6e59e36a3a3.avif","./assets/1a1e20df4d63402e939d.wav","./assets/fc5d00caa241f4ca78d6.wav","./assets/653de77d9e921261504e.wav","./assets/b06f5ea4a463e3cf4a3b.webp","./assets/07bb52a3e61516fdb460.wav","./assets/6433f7eca74246c2b67d.wav","./assets/e51cb891556075588a6e.webp","./assets/508515f0d14b5a96cbb1.webp","./assets/14190c16af849806ce1d.wav","./assets/52dc24c0429ea6ccc5b5.webp","./assets/550cb53ddb0396240b90.wav","./assets/797634a298ea6a94ed0d.webp","./assets/1f470514a0155c8553cd.webp","./assets/f49d514f83e3b869cbd5.wav","./assets/052c181a1799e90f8a9c.webp","./assets/d5576ff1f1c37e15d00a.js","./assets/1825443918a7de6d2e0a.webp","./modules/basa-tayo.html","./modules/letter-slide.html","./modules/fluency-pyramid.html","./modules/basa-bata-basa.html","./modules/kuwento-tayo.html","./modules/awad.html","./assets/kuwento/b0cff64624a0f794547c.webp","./assets/kuwento/51b6ef0d877cfd2636f9.webp","./assets/kuwento/59090a09002ff643b1ca.webp","./assets/kuwento/2b2f3c578b9371d1d5fb.webp","./assets/kuwento/0fbb9b7fc550d680117c.webp","./assets/kuwento/884a1f84e2175e4511ba.webp","./assets/kuwento/968d9dbbe7683c658d7e.webp","./assets/kuwento/dc4a3264fab60fbeb84a.webp","./assets/kuwento/4f9eb76d8279fabd00bc.webp","./assets/kuwento/8fa96eb9ccbedfd4c547.webp","./assets/kuwento/24677d7f64f5dd55b1fd.webp","./assets/kuwento/c8771c9f3fa2feb98ad3.webp","./assets/kuwento/d536389280cc4b050506.webp","./assets/kuwento/5625512f67003f8c4e69.webp","./assets/kuwento/0dcfeb54a8e467ff361a.webp","./assets/kuwento/339741e53840a3308e2c.webp","./assets/kuwento/5dc6baecec80827ad46d.webp","./assets/kuwento/19e8f0b1ad03d5f0ce3e.webp","./assets/kuwento/875d499ca5d00ff3f0b2.webp","./assets/kuwento/7077623b8803305cd05b.webp","./assets/kuwento/599ca9f6c6d8db034c1a.webp","./assets/kuwento/472f0fe98c38157730bb.webp","./assets/kuwento/189cf0682b5248dfe03a.webp","./assets/kuwento/02886e1e1ea2cb762268.webp","./assets/kuwento/28b29d1b5d8d1bfe1b7d.webp","./assets/kuwento/1bc06665c06d47467795.webp","./assets/kuwento/96fbd14da6950ba1fe7a.webp","./assets/kuwento/6869d730276ccbe8b393.webp","./assets/kuwento/21c090b5c8d7d9361bef.webp","./assets/kuwento/f038de3b35de093006f6.webp","./assets/kuwento/968d4922fead78fc1e9c.webp","./assets/kuwento/ab85c872cfc8751568eb.webp","./assets/kuwento/0052cb4eca60582a5a4c.webp","./assets/kuwento/3225c4517b8ab6fe4b60.webp","./assets/kuwento/3cb5d995cd85f9947667.webp","./assets/kuwento/e81e6894c3af996cc08c.webp","./assets/kuwento/e4910f9f1a1ca1644948.webp","./assets/kuwento/8c0085b2da1c513537ac.webp","./assets/kuwento/227ba51bc67c9538a8d6.webp","./assets/kuwento/e08731c89913f204decd.webp","./assets/kuwento/89ba3205c554398be265.webp","./assets/kuwento/a73b71d64137575435df.webp","./assets/kuwento/836ed31db3367bb1af2f.webp","./assets/kuwento/df8bf8d4fce84130290f.webp","./assets/kuwento/9e3ac5c67f72a96fbb07.webp","./assets/kuwento/e88cf132dc91d876a2e8.webp","./assets/kuwento/d1dbaf6764a87da725df.webp","./assets/kuwento/c2ea331945aacf50db87.webp","./assets/kuwento/9485d6fad415b29198fa.webp","./assets/kuwento/d9c5ec98179db491c46d.webp","./assets/kuwento/14b21e7f25c53878c3d8.webp","./assets/kuwento/a13b11a6b8f0ef255f25.webp","./assets/kuwento/2c7f6babb52977be06c7.webp","./assets/kuwento/28eddbd7f8d58fa6468d.webp","./assets/kuwento/5bddab85eab53fabacad.webp","./assets/kuwento/2a649eeabf21e47296f0.webp","./assets/kuwento/f5540981095d27817572.webp","./assets/kuwento/fa5e5b085c655d244bfb.webp","./assets/kuwento/7c98ea6c8891f7a9671b.webp","./assets/kuwento/04a96c71859f9df4b190.webp","./assets/kuwento/4a40e05ca9d2084c215c.webp","./assets/kuwento/076d93bc657e6d1e8f4e.webp","./assets/kuwento/659b5731c81163a40814.webp","./assets/kuwento/1f611e651356270ff300.webp","./assets/kuwento/f84204ded482faa6da68.webp","./assets/kuwento/ded1b46eb0856c01783c.webp","./assets/kuwento/9cdfc16f2266cf8e067a.webp","./assets/kuwento/c84942a2a55f573c0f32.webp","./assets/kuwento/8078c57ba9a720ce4d76.webp","./assets/kuwento/faeb511915bb77f1e05a.webp","./assets/kuwento/97524adee007a0bec0b0.webp","./assets/kuwento/6a8b07b2fc37fc309b7a.webp","./assets/kuwento/a23968cc465c2958e765.webp","./assets/kuwento/7cfb4a8d4b919d821498.webp","./assets/kuwento/cb121e4bcefda40fa401.webp","./assets/kuwento/5769464f634c096d9e22.webp","./assets/kuwento/b746345c85ea47570831.webp","./assets/kuwento/2ceddcc46f3087eae441.webp","./assets/kuwento/d542b54c11be118a9628.webp","./assets/kuwento/6918c1f5cc0ed5adade4.webp","./assets/kuwento/ab4ffacf080840c60ac1.webp","./assets/kuwento/b3a3780a463e3d44d39c.webp","./assets/kuwento/9dfcf05e392eafe05176.webp","./assets/kuwento/1b13203f8beaa16531ae.webp","./assets/kuwento/b4a2d298e92690f36cce.webp","./assets/kuwento/bb4502fc954493872d57.webp","./assets/kuwento/92af59a1951eb0b47b34.webp","./assets/kuwento/bbd7c7e0a283b0db68d4.webp","./assets/kuwento/08f17bf30115a78513d8.webp","./assets/kuwento/076941a4420bcac49e5e.webp","./assets/kuwento/ec7be8bc808f80ff9ed6.webp","./assets/kuwento/033a014ea3565d3c00a5.webp","./assets/kuwento/2f62e32466401947e2ed.webp","./assets/kuwento/928898ca38e84ad44a02.webp","./assets/kuwento/19c586bd4ecb783fbb7b.webp","./assets/kuwento/2ac68a84b03eebf49fe6.webp","./assets/kuwento/726e8e313695f2851c64.webp","./assets/kuwento/19dde34012fdd587a178.webp","./assets/kuwento/5ab9b18530ec692140b2.webp","./assets/kuwento/0ff338e935e70384d0dc.webp","./assets/kuwento/d1a5c15ba363b5bcfe45.webp","./assets/kuwento/e54088a1669ee7a68273.webp","./assets/kuwento/b52fb2f306152f19e5a3.webp","./assets/kuwento/e5c36145c43d0dd62598.webp","./assets/kuwento/72a2c1969c9d1598fbc8.webp","./assets/kuwento/45f4998cfd6fea2e10ee.webp","./assets/kuwento/bf1f750165f423aee980.webp","./assets/kuwento/6cfeff8fd0a7d6fb950f.webp","./assets/kuwento/a019d1096d132616b7b2.webp","./assets/kuwento/b56d11024800ca04638c.webp","./assets/kuwento/13c178e1632aec25bc32.webp","./assets/kuwento/7559539838ac72bef9cf.webp","./assets/kuwento/1b327b56de4ee3f34ec3.webp","./assets/kuwento/4cedb73c235d2c7464f0.webp","./assets/kuwento/0e0cc93dd936ca8ff292.webp","./assets/kuwento/02300cd8c60597c5afd5.webp","./assets/kuwento/932178bd7f6488636354.webp","./assets/kuwento/8b5030340dfac107cdee.webp","./assets/kuwento/a3e08d12418b39dd95e9.webp","./assets/kuwento/acb5950fbd4d0d2d3ffb.webp","./assets/kuwento/b4a416c7bb5da7de7490.webp","./assets/kuwento/db54546df3de98701966.webp","./assets/kuwento/0b38ac1a2a839f5a06f5.webp","./assets/kuwento/6a7bed1064a472e4ba31.webp","./assets/kuwento/9cd6921efbd2c252563b.webp","./assets/kuwento/94eb94cca1b1636ca3bb.webp","./assets/kuwento/3a2c986db1fcaa3df929.webp","./assets/kuwento/abeeff1650d81ff214f4.webp","./assets/kuwento/dd551af0c5e7c081f69e.webp","./assets/kuwento/955601fa579d10780a44.webp","./assets/kuwento/0e68fe375867e150f924.webp","./assets/kuwento/b2fd2776f5a6effa3751.webp","./assets/kuwento/7490b6478564e86c39b8.webp","./assets/kuwento/9a158c2265813f059683.webp","./assets/kuwento/50dac030d04bf964eeb2.webp","./assets/kuwento/f43491586fa50c3e8fb7.webp","./assets/kuwento/f95da514b2aa09e2d4c4.webp","./assets/kuwento/404d93db9ce9578e49c8.webp","./assets/kuwento/3cf7d8f3bbd707bab0c4.webp","./assets/kuwento/0861f71adc4d6c740ba6.webp","./assets/kuwento/852e7644101a78f1f5bc.webp","./assets/kuwento/ae8b618c28ab69513736.webp","./assets/kuwento/7b22299b8fbe081de10f.webp","./assets/kuwento/cf1c73029864ed7d3f39.webp","./assets/kuwento/58020699cb622b9e7ba7.webp","./assets/kuwento/db79982cc181cbfdfd5b.webp","./assets/kuwento/008a8beb9f78389eb8ca.webp","./assets/kuwento/b647a69d4ff548c670ec.webp","./assets/kuwento/ff2f14ba483a55831c9d.webp","./assets/kuwento/2a397b79e242689ea0e0.webp","./assets/kuwento/d6c660ef8589dbc61805.webp","./assets/kuwento/bf0b3e289c64e8cc83b8.webp","./assets/kuwento/2548c2e202f862e1870c.webp","./assets/kuwento/318b5cd9ef942efb5d5f.webp","./assets/kuwento/247b5b5e91d27a341317.webp","./assets/kuwento/be284ed91c52e3f8f3db.webp","./assets/kuwento/138f22658a3193f67307.webp","./assets/kuwento/70a257451664a217df8b.webp","./assets/kuwento/8a846b96741c30096140.webp","./assets/kuwento/2710816b26412d7f87d1.webp","./assets/kuwento/f5aa7bcb4e1b26e5447e.webp","./assets/kuwento/d32f69ce763ec08f2d4b.webp","./assets/kuwento/38ec44b18e0e3b22535a.webp","./assets/kuwento/2c675a64ffeb80dffd7d.webp","./assets/kuwento/cf5662eb3fe371e3b430.webp","./assets/kuwento/bb45c5fa78f16a296d25.webp","./assets/kuwento/594b481af06bd6428cb0.webp","./assets/kuwento/267f23557f31addc685e.webp","./assets/kuwento/0b9cc230ecfced23f0b6.webp","./assets/kuwento/192706abfd119e4705ee.webp","./assets/kuwento/8b100d9ec59459c12414.webp","./assets/kuwento/fdeed9bdc4f742b68d6b.webp","./assets/kuwento/8cfb65c64b35463339ff.webp","./assets/kuwento/dd9c983c96f0fd84d836.webp","./assets/kuwento/2af52d9ab651ba5dd5b7.webp","./assets/kuwento/5d576e031a9d42575cf5.webp","./assets/kuwento/d5b15b6dd27efc3b909a.webp","./assets/kuwento/5cc7c2ab29fdde0faf25.webp","./assets/kuwento/6fe9f10d94a95aef6ad6.webp","./assets/kuwento/229c4011bd14aa8fed6d.webp","./assets/kuwento/c862844801ddb82c0d89.webp","./assets/kuwento/8bef755dc02b88022f9e.webp","./assets/kuwento/943821b7918e8ce050d4.webp","./assets/kuwento/c91e9661e8d94bcc0f3c.webp","./assets/kuwento/3365799886f6a1345c2e.webp","./assets/kuwento/c048e944271eadb16c5b.webp","./assets/kuwento/654c8b42c0cf101bfc56.webp","./assets/kuwento/c889e42d98f832e81135.webp","./assets/kuwento/25aeb539e8b64d1b7c36.webp","./assets/kuwento/d667d1b4c934af9e875e.webp","./assets/kuwento/82f238cf8f02a9b952a2.webp","./assets/kuwento/c35016a7364bf3446cdd.webp","./assets/kuwento/9e8af42dc9b57a21b617.webp","./assets/kuwento/2fca3c5d96b9a9711df4.webp","./assets/kuwento/bedcd763e817bab5d78f.webp","./assets/kuwento/d8fe819ecb56bef91d42.webp","./assets/kuwento/047d69bdf47d52ef72b8.webp","./assets/kuwento/cfe26e0366560f9204dc.webp","./assets/kuwento/05aea642e87e17aee911.webp","./assets/kuwento/db11bfec1dcee91eda09.webp","./assets/kuwento/43a0b938205659803349.webp","./assets/kuwento/05396b5c0fff4512f468.webp","./assets/kuwento/a27711d44a58c59e0ff9.webp","./assets/kuwento/bf8a0b272593479ee02e.webp","./assets/kuwento/b8f013aa8203637ce0ba.webp","./assets/kuwento/f9bfdc4f3a0f2fd28ee1.webp","./assets/kuwento/5422fbe2159d2a32b50c.webp","./assets/kuwento/c59c4f418cb49135bfc5.webp","./assets/kuwento/899f0363f965f298ff92.webp","./assets/kuwento/6b6e49be2198367015e7.webp","./assets/kuwento/4d8a590fcdc6ec07d3aa.webp","./assets/kuwento/66b06637a44504fdc767.webp","./assets/kuwento/72722dfa31a293fa4abd.webp","./assets/kuwento/0c43088233ad9589da39.webp","./assets/kuwento/a17f47e6370799accd40.webp","./assets/kuwento/f89e855f8d8f6c0d1675.webp","./assets/kuwento/07f22dc80c45cde36dec.webp","./assets/kuwento/9ec31d2ff172a31598e1.webp","./assets/kuwento/829183de910c1138c4a5.webp","./assets/kuwento/67a28b64430c2ae360c1.webp","./assets/kuwento/53b2282136b56e2565a6.webp","./assets/kuwento/70e27629e383828f6c4b.webp","./assets/kuwento/46e8f101fc2a64153be8.webp","./assets/kuwento/1459c0637ec9f3ec0b85.webp","./assets/kuwento/22cc60433dc4bf6c14e7.webp","./assets/kuwento/9884b956453f4d0df219.webp","./assets/kuwento/6de95e2641e552f1142c.webp","./assets/kuwento/695f3cc070179692db95.webp","./assets/kuwento/e8ad39d705dae5da56ea.webp","./assets/kuwento/b797503fa61da97f996c.webp","./assets/kuwento/bc8fd443b8286480c27e.webp","./assets/kuwento/e53dd33296346cf98e8d.webp","./assets/kuwento/bd5aab335d6846c77786.webp","./assets/kuwento/5fcd33bf6c8956ca163f.webp","./assets/kuwento/c74b91953806cb0ef736.webp","./assets/kuwento/d3e3ac6b58f63d2ad502.webp","./assets/kuwento/804dc189472f94f66181.webp","./assets/kuwento/b1e7340164e769d0ada2.webp","./assets/kuwento/e27c9c8d70709a6dd1e0.webp","./assets/kuwento/6eec918ed51eab211c2a.webp","./assets/kuwento/83d675e2f845ea74549f.webp","./assets/kuwento/f6f393ea2d07ecfce195.webp","./assets/kuwento/35325e36c149b835a7c8.webp","./assets/kuwento/cad585c38471ef541ac4.webp","./assets/kuwento/bb822a7b50ea2aa37c28.webp","./assets/kuwento/6200651c944976750e36.webp","./assets/kuwento/fc5a16f3836de040271c.webp","./assets/kuwento/aab09aa90a55e39161e3.webp","./assets/kuwento/0e969265638c93fa2f0b.webp","./assets/kuwento/487da2448faa2fa69743.webp","./assets/kuwento/59570b4b499441aa292e.webp","./assets/kuwento/d2faca3ad8524fc4f61d.webp","./assets/kuwento/d1c999ef86e8919285b0.webp","./assets/kuwento/4b570a162628ecaf8d1f.webp","./assets/kuwento/94b3b1c5ee424312b00f.webp","./assets/kuwento/38efd3a3e5deff9c8561.webp","./assets/kuwento/c1d0a65a75be8ee48fd9.webp","./assets/kuwento/6a691ae3982661a5fbff.webp","./assets/kuwento/1b888c17c505d54d7b66.webp","./assets/kuwento/64e07ffcf611c5a772a2.webp","./assets/kuwento/b56ecf7c20f1c0777ee2.webp","./assets/kuwento/e72364f26be8155dd540.webp","./assets/kuwento/38a45c3f67310825c132.webp","./assets/kuwento/0d65c5a1beec2bb20aac.webp","./assets/kuwento/1c1cdd6923a67686083c.webp","./assets/kuwento/5b0fc63bf412242de1e9.webp","./assets/kuwento/952ca138af52ba0fe9c4.webp","./assets/kuwento/d3bf55c966af1163f185.webp","./assets/kuwento/21822fc6ca84442f667d.webp","./assets/kuwento/c97cbabdf23d56fcc0ee.webp","./assets/kuwento/f222510b97e02490d0c7.webp","./assets/kuwento/bef8105be84b30e75e2f.webp","./assets/kuwento/8ee044b56ab3f8563054.webp","./assets/kuwento/d36feb9bf26a7e271a07.webp","./assets/kuwento/d33bba16775bd97845ec.webp","./assets/kuwento/8aca427c032fa3afcfb4.webp","./assets/kuwento/0b35e2d8f68e6124e992.webp","./assets/kuwento/08282bf7a62967fb7c57.webp","./assets/kuwento/0d317f8264286742a591.webp","./assets/kuwento/475d66d4b9c58cc4c91c.webp","./assets/kuwento/316d32ad057cfff362d5.webp","./assets/kuwento/bc9ce91403eea48d8825.webp","./assets/kuwento/36da717d9ee12b02cdbe.webp","./assets/kuwento/293e0de5f26890c03e0e.webp","./assets/kuwento/302239ab1641ceee74af.webp","./assets/kuwento/c87016186c87da72bf07.webp","./assets/kuwento/d84499da1fd8bc0b85f8.webp","./assets/kuwento/f3bab1408ed3de88bf71.webp","./assets/kuwento/ad14013e452619b4e59e.webp","./assets/kuwento/2d8a6060e9cd239cc4bd.webp","./assets/kuwento/30e5ec5701234ecee9bf.webp","./assets/kuwento/e5bb348455e809d8b4ab.webp","./assets/kuwento/35504472b6563012f05a.webp","./assets/kuwento/eaa80cd1e93a46c1aea3.webp","./assets/kuwento/240946a125e48c73c76f.webp","./assets/kuwento/dbe9025e9a1a9c0a1ec9.webp","./assets/kuwento/f7ddd176b32c26942afc.webp","./assets/kuwento/22256ca7d85ef0132562.webp","./assets/kuwento/4f1fb8b646cc6ad70645.webp","./assets/kuwento/20b7c0d03279d3e998ae.webp","./assets/kuwento/ff6392cb03aa2fcc6a5e.webp","./assets/kuwento/f075a649aa9bee32d617.webp","./assets/kuwento/432a1da12bacd523f7a3.webp","./assets/kuwento/048b65c31e88045d0602.webp","./assets/kuwento/32188ba6e81a311b4934.webp","./assets/kuwento/929632caae58c813a720.webp","./assets/kuwento/b721760bb8b001a0ed8b.webp","./assets/kuwento/18c43ad7f219219402af.webp","./assets/kuwento/d66b72869f66d31faca7.webp","./assets/kuwento/df8be22f59c1b4f437b6.webp","./assets/kuwento/4324a9e51f6787db7bae.webp","./assets/kuwento/44cecd54d8423bbd4865.webp","./assets/kuwento/666cc009ae767f97651e.webp","./assets/kuwento/7eb7d876411406b7c925.webp","./assets/kuwento/bd180105dc39575f9df3.webp","./assets/kuwento/452ef9ead80d5f0ae700.webp","./assets/kuwento/f8f4944f77ae2b87c62c.webp","./assets/kuwento/2f2fecbf5d16f831c63a.webp","./assets/kuwento/e4f5ec51e9b5881af9f4.webp","./assets/kuwento/c86c1d78700fd5d278c7.webp","./assets/kuwento/87eeecc8ae366a5d4585.webp","./assets/kuwento/962a701823a7348ce0cb.webp","./assets/kuwento/ba4c6fbc0069bda35dd6.webp","./assets/kuwento/12d52fcc3a7bfd685dfc.webp","./assets/kuwento/7f3bb5d4d936f17de9d2.webp","./assets/kuwento/9ed7cf0dfddc9db0c9f7.webp","./assets/kuwento/19159ee34b810aeb4c9b.webp","./assets/kuwento/79b86dfc1d6daea19c18.webp","./assets/kuwento/8b346e3a5a68cb7589f1.webp","./assets/kuwento/ab8b7943134f47809aed.webp","./assets/kuwento/b9f810f2ba91f4fa6559.webp","./assets/kuwento/e21e0f1a4d44834b1449.webp","./assets/kuwento/6d5342c0d4302aa31773.webp","./assets/kuwento/0fd402e90becba9ef0e6.webp","./assets/kuwento/ea28e8d5e550b1e0d707.webp","./assets/kuwento/f4a201d6f5b7fca6b581.webp","./assets/kuwento/56a2ba279efc78df3b9f.webp","./assets/kuwento/1c260504ae8e36a46d62.webp","./assets/kuwento/c1c9d4fde17d71553845.webp","./assets/kuwento/856a5f9ab9fadaf77600.webp","./assets/kuwento/8b0954e7a17b456bae8a.webp","./assets/kuwento/245eb3e696c6fd58c6a1.webp","./assets/kuwento/ea5b77c7fa53369d1933.webp","./assets/kuwento/a30509138940b0f35b2c.webp","./assets/kuwento/893baf9ebe85c077254d.webp","./assets/kuwento/c3dbcd9e5d32d9f2b34c.webp","./assets/kuwento/aa409829c5cfdc957515.webp","./assets/kuwento/ed271ccadf2c31d20577.webp","./assets/kuwento/251b61e508e379b6df01.webp","./assets/kuwento/f5e9870d568f73eee323.webp","./assets/kuwento/7a6087233efcd3e0644a.webp","./assets/kuwento/44fde475b81ed5dfc3dd.webp","./assets/kuwento/a43cf441f898208b0f07.webp","./assets/kuwento/c65e56be45647d94605f.webp","./assets/kuwento/8f782cf7f90952ed64b1.webp","./assets/kuwento/ac4ce5b670de14211c97.webp","./assets/kuwento/5b77e41b6e8e44cc59ea.webp","./assets/kuwento/42bb089830f48952ddc0.webp","./assets/kuwento/0b4c4eae0d42b3cdeb06.webp","./assets/kuwento/9073541540edb05a6a62.webp","./assets/kuwento/c1fe6c60639b7e20d92a.webp","./assets/kuwento/e2f017bf9051cfdcbd4e.webp","./assets/kuwento/1f0bae97cad9bf751c59.webp","./assets/kuwento/1793c12cc7945f6d1405.webp","./assets/kuwento/8952b770c6351298256d.webp","./assets/kuwento/8b339696dc02b5b4dc30.webp","./assets/kuwento/bb450e900573a791a53d.webp","./assets/kuwento/800f32990e8dd872a6f1.webp","./assets/kuwento/c0ea5acc64fc644902a2.webp","./assets/kuwento/1384e7f6bf7260bc4749.webp","./assets/kuwento/a1bf967091066f1040b2.webp","./assets/kuwento/58341dcbd7037732e98f.webp","./assets/kuwento/1bc774d840ad9c676529.webp","./assets/kuwento/63632c45fdbdadbb92ee.webp","./assets/kuwento/787b9ca88d24e771205a.webp","./assets/kuwento/788575d68b2258fb88ec.webp","./assets/kuwento/a1f927a8a65b3f7d67c8.webp","./assets/kuwento/e206ef140aa35a872820.webp","./assets/kuwento/6a44796aa5285f5220b0.webp","./assets/kuwento/a39787c14aa0fa1e6048.webp","./assets/kuwento/957fb1a5f343080d4a21.webp","./assets/kuwento/eb9090622cf52f09e25f.webp","./assets/kuwento/be411a9b9afb24d5b1e8.webp","./assets/kuwento/796f4326d4e30ae380bb.webp","./assets/kuwento/3251d6bf2829d2ccc5ce.webp","./assets/kuwento/cf48fc315106a29c6cd1.webp","./assets/kuwento/57307b11b38179c4d7ee.webp","./assets/kuwento/fa156ccb06ffe6e67fe2.webp","./assets/kuwento/a88ce98028b54aeaaf36.webp","./assets/kuwento/a87deeec59c402e45a35.webp","./assets/kuwento/7ea531d441515ebfa81c.webp","./assets/kuwento/d506e1b01bdcf52444a4.webp","./assets/kuwento/cf8c8d82ffd1372ce578.webp","./assets/kuwento/fab6a734f054d8e393f2.webp","./assets/kuwento/e73bd311a8ace26630ad.webp","./assets/kuwento/96b631aba2ddaced9b13.webp","./assets/kuwento/90cec1bee700c57566d2.webp","./assets/kuwento/a0f46a244cb044662ab8.webp","./assets/kuwento/4dcd0dd3ecc712e995e4.webp","./assets/kuwento/8dbd74fc4d523f137e96.webp","./assets/kuwento/a86c64b4745a9b89a47e.webp","./assets/kuwento/b1b8bba5152ce9c49415.webp","./assets/kuwento/57e57ab07b6e82852ffe.webp","./assets/kuwento/40635eaa2e107e1f0d5c.webp","./assets/kuwento/056955ad25765080d75e.webp","./assets/kuwento/8463717bd923895fd4c7.webp","./assets/kuwento/4d1449c06228fcb81e74.webp","./assets/kuwento/5e3b64499d2e87b97420.webp","./assets/kuwento/396d5621e2a2bb1078c6.webp","./assets/kuwento/a1aab3dae1167e24f3fb.webp","./assets/kuwento/62b8bbabd995fd7223be.webp","./assets/kuwento/f8cfc15e2862dafb43fc.webp","./assets/kuwento/10ae8b257d1d11d01adb.webp","./assets/kuwento/78603cfbd50e52d833bf.webp","./assets/kuwento/4ac5968e5d0daab1dbdd.webp","./assets/kuwento/cd6f317106fe6e1b8d64.webp","./assets/kuwento/b07326769ba9a97d472c.webp","./assets/kuwento/1818dac3e6e1ece0d605.webp","./assets/kuwento/f87bfd6e3a5824802d83.webp","./assets/kuwento/9cdd5ae9fa689e3bfb71.webp","./assets/kuwento/70219c6030dc75c736d1.webp","./assets/kuwento/73d54617e681c17519ff.webp","./assets/kuwento/bbde31ad3b55b8d68fd1.webp","./assets/wq-basa-v40-b049eba5238735870e67.webp","./assets/wq-basa-v40-8f79b52f7a6c92dc8580.webp","./assets/wq-basa-v40-d554c891870cd48d3593.webp","./assets/wq-basa-v40-74910972331fa1f2ef51.webp","./assets/wq-basa-v40-f99a2635d571a176c6e2.webp","./assets/wq-basa-v40-0bbae5a49d3810be588a.webp","./assets/wq-basa-v40-13133d298cbf7e3ea0f6.webp","./assets/wq-basa-v40-5dd2514f69be81d978d2.webp","./assets/wq-basa-v40-ab8553bdb540b388c2f0.webp","./assets/wq-basa-v40-7da5ad4367de7462f274.webp","./assets/wq-basa-v40-6eaa66b467fbbdd1e22e.webp","./assets/wq-basa-v40-9b9068cc8f9d9c7d7f76.webp","./assets/wq-basa-v40-6135d0c22460e94a3c52.webp","./assets/wq-basa-v40-efbf0ed598dd3e8c07c4.webp","./assets/wq-basa-v40-d1c43893e6f17704a710.webp","./assets/wq-basa-v40-4f47f6954c45cbf70cd6.webp","./assets/wq-basa-v40-e8d86dc55373c134f353.webp","./assets/wq-basa-v40-c525917316668b8aa0ba.webp","./assets/wq-basa-v40-6278c5c57cf067fd3cd3.webp","./assets/wq-basa-v40-49e690e4219704ae6b7c.webp","./assets/wq-basa-v40-00153bfd5cd1bfbb2168.webp","./assets/wq-basa-v40-dee8ff13bd15f614c7b7.webp","./assets/wq-basa-v40-8932c7e5a5ddfbdd4841.webp","./assets/wq-basa-v40-141442449ac9b42784db.webp","./assets/wq-basa-v40-517cbe34ab6d4a779ffa.webp","./assets/wq-basa-v40-e41b794e3b703d9e5087.webp","./assets/wq-basa-v40-62ff34271c40e556d29b.webp","./assets/wq-basa-v40-e47a7d2c8c9a1913ff9a.webp","./assets/wq-basa-v40-ba13caee2a505b615426.webp","./assets/wq-basa-v40-4e440bfbe79fa3696821.webp","./assets/wq-basa-v40-c192066593c4ed79fde4.webp","./assets/wq-basa-v40-1827eb09d1f3a3f2a831.webp","./assets/wq-basa-v40-bb0f2e8c258874e7f0a6.webp","./assets/wq-basa-v40-3d8211f15b433b229111.webp","./assets/wq-basa-v40-a5fa8352c0f214e7f4e2.webp","./assets/wq-basa-v40-0955b75d29276e7f8e21.webp","./assets/wq-basa-v40-87c572d66bbb374434f1.webp","./assets/wq-basa-v40-2bb7f7399c1c03ef9e75.webp","./assets/wq-basa-v40-cd84514b698658421362.webp","./assets/wq-basa-v40-b848dcbb5cce383a17b0.webp","./assets/wq-basa-v40-820aa448b7dad8f6cd96.webp","./assets/wq-basa-v40-ddf4e2963fe18fb14dce.webp","./assets/wq-basa-v40-6470638c917daad8835b.webp","./assets/wq-basa-v40-ef7036583ec063151103.webp","./assets/wq-basa-v40-41fbd9356779a026e359.webp","./assets/wq-basa-v40-77612195cf1a9deefba0.webp","./assets/wq-basa-v40-d1e69815fd300b53744b.webp","./assets/wq-basa-v40-24ae8dbd690f52b7501f.webp","./assets/wq-basa-v40-c5b3966af612ddc92cf2.webp","./assets/wq-basa-v40-1b45ef531312ac4a7cb3.webp","./assets/wq-basa-v40-07ebf324d47cbd8b9fc4.webp","./assets/wq-basa-v40-44d7bdbe7d4cd1b05b30.webp","./assets/wq-basa-v40-62bd2530528fcbe66a98.webp","./assets/wq-basa-v40-64e4f571f9308274455f.webp","./assets/wq-basa-v40-466468c25741dc83788c.webp","./assets/wq-basa-v40-e50dc6f59a40f17554f1.webp","./assets/wq-basa-v40-9e0bd8175f3d0cc8ec86.webp","./assets/wq-basa-v40-91833b3bc47b887709a8.webp","./assets/wq-basa-v40-8454bac4f74135c2fae9.webp","./assets/wq-basa-v40-3be11c4b4c57aaf2df8c.webp","./assets/wq-basa-v40-06e2fd30d26411035826.webp","./assets/wq-basa-v40-d5d6b2e061107d96de9d.webp","./assets/wq-basa-v40-5d76f4ac0a613b56d56c.webp","./assets/wq-basa-v40-626043ef50cb701e7190.webp","./assets/wq-basa-v40-693ad1b55ba9bea7a882.webp","./assets/wq-basa-v40-db983e060fd29667b9f5.webp","./assets/wq-basa-v40-34a729e2f5a37fe0cbe7.webp","./assets/wq-basa-v40-bb253b09de44539ffee1.webp","./assets/wq-basa-v40-4188008db55f72ec4eb2.webp","./assets/wq-basa-v40-b6e8c3a9ad43e947e9fc.webp","./assets/wq-basa-v40-9a34df44b0e07a5950e0.webp","./assets/wq-basa-v40-f171c8d3b1a2eb1ab0df.webp","./assets/wq-basa-v40-d953d0a3adcb48f580c1.webp","./assets/wq-pantig-v41-be-berde.webp","./assets/wq-pantig-v41-de-delata.webp","./assets/wq-pantig-v41-ge-gelatina.webp","./assets/wq-pantig-v41-ho-hopia.webp","./assets/wq-pantig-v41-hu-huni.webp","./assets/wq-pantig-v41-ke-keso.webp","./assets/wq-pantig-v41-ki-kilay.webp","./assets/wq-pantig-v41-ko-kotse.webp","./assets/wq-pantig-v41-lu-lupa.webp","./assets/wq-pantig-v41-mi-mikropono.webp","./assets/wq-pantig-v41-mo-motor.webp","./assets/wq-pantig-v41-ne-negosyo.webp","./assets/wq-pantig-v41-zu-special.webp","./assets/wq-pantig-v41-yi-special.webp","./assets/wq-pantig-v41-xu-special.webp","./assets/wq-pantig-v41-xo-special.webp","./assets/wq-pantig-v41-xi-special.webp","./assets/wq-pantig-v41-wu-wushu.webp","./assets/wq-pantig-v41-wo-wok.webp","./assets/wq-pantig-v41-we-special.webp","./assets/wq-pantig-v41-vu-special.webp","./assets/wq-pantig-v41-to-tomate.webp","./assets/wq-pantig-v41-se-selyo.webp","./assets/wq-pantig-v41-po-polvoron.webp","./assets/wq-pantig-v41-pe-pera.webp","./assets/wq-pantig-v41-ngo-special.webp","./assets/wq-pantig-v41-nge-puzzled.webp","./assets/wq-pantig-v41-nyu-special.webp","./assets/wq-pantig-v41-nyo-special.webp","./assets/wq-pantig-v41-nyi-special.webp","./assets/wq-pantig-v41-nye-special.webp","./assets/wq-pantig-v41-nya-special.webp"];

function absoluteURL(url) {
  return new URL(url, self.registration.scope).href;
}

const MUTABLE_LEGACY_ASSET_NAMES = new Set([
  '5e1a0ec95f148cb4a86e.png',   // Letter Slide kid was intentionally replaced in-place.
  '0b7e54570ed9ce1be11c.png',   // AWAD home artwork was intentionally replaced in-place.
  '28ac6dc14b0d05ae83a3.png',   // Fluency Pyramid home artwork was intentionally replaced in-place.
  '822462614eeb037d5aaa.webp',  // Basa, Bata, Basa! home artwork was intentionally replaced in-place.
  '5db173593080c179efda.png',   // Letter Slide home artwork is a curated editable shell.
  '13cb35019492c37feeed.webp'   // Kuwento Tayo curated home artwork.
]);

function isMutableAppAssetURL(url) {
  try {
    const parsed = new URL(url, self.registration.scope);
    if (parsed.origin !== self.location.origin || !parsed.pathname.includes('/assets/')) return false;
    const name = parsed.pathname.split('/').pop() || '';
    // WonderQuest-owned/versioned UI files are intentionally editable and should
    // refresh from the network when a new release is published.
    return name.startsWith('wq-') || MUTABLE_LEGACY_ASSET_NAMES.has(name);
  } catch (_) {
    return false;
  }
}

function isImmutableAssetURL(url) {
  try {
    const parsed = new URL(url, self.registration.scope);
    if (parsed.origin !== self.location.origin || !parsed.pathname.includes('/assets/')) return false;
    if (isMutableAppAssetURL(parsed.href)) return false;
    const name = parsed.pathname.split('/').pop() || '';
    // Only true generated hash filenames are treated as immutable. This keeps the
    // large lesson/media library fast while editable WonderQuest artwork remains fresh.
    return /^[a-f0-9]{20}\.[a-z0-9]+$/i.test(name);
  } catch (_) {
    return false;
  }
}

const CURRENT_ASSET_URLS = new Set(
  [...CORE, ...OFFLINE_INVENTORY]
    .filter(isImmutableAssetURL)
    .map(absoluteURL)
);

async function findExistingResponse(url) {
  const abs = absoluteURL(url);
  const direct = await caches.match(abs, { ignoreSearch: true });
  return direct || null;
}

async function fetchFresh(url) {
  const abs = absoluteURL(url);
  const request = new Request(abs, { cache: 'reload' });
  const response = await fetch(request);
  if (!response || !response.ok) throw new Error(`Failed to fetch ${url}`);
  return { abs, response };
}

async function installCore() {
  const coreCache = await caches.open(CORE_CACHE);
  for (const url of CORE) {
    const abs = absoluteURL(url);
    // A content-hashed asset can be safely reused from the previous release.
    // Mutable HTML/JS/manifest files are always fetched fresh.
    if (isImmutableAssetURL(url)) {
      const existing = await findExistingResponse(url);
      if (existing) {
        await coreCache.put(abs, existing.clone());
        continue;
      }
    }
    const { response } = await fetchFresh(url);
    await coreCache.put(abs, response.clone());
  }
}

async function migrateLegacyAssets() {
  const assetCache = await caches.open(ASSET_CACHE);
  const keys = await caches.keys();

  for (const cacheName of keys) {
    if (cacheName === ASSET_CACHE || cacheName === CORE_CACHE) continue;
    if (!cacheName.startsWith('teacher-francis-reading-world-pwa-v') && !cacheName.startsWith('wonderquest-reading-world-pwa-v')) continue;

    const legacy = await caches.open(cacheName);
    const requests = await legacy.keys();

    // Move current content-hashed assets one at a time, deleting each source
    // entry after the copy. This avoids temporarily duplicating the entire
    // offline library and is much friendlier to mobile storage quotas.
    for (const request of requests) {
      const abs = request.url;
      if (!CURRENT_ASSET_URLS.has(abs)) continue;
      if (!(await assetCache.match(abs, { ignoreSearch: true }))) {
        const response = await legacy.match(request);
        if (response) await assetCache.put(abs, response.clone());
      }
      await legacy.delete(request);
    }

    await caches.delete(cacheName);
  }
}

async function pruneRemovedAssets() {
  const assetCache = await caches.open(ASSET_CACHE);
  for (const request of await assetCache.keys()) {
    if (!CURRENT_ASSET_URLS.has(request.url)) await assetCache.delete(request);
  }
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    await installCore();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await migrateLegacyAssets();
    await pruneRemovedAssets();

    // Remove old versioned app-shell caches. The stable ASSET_CACHE remains so
    // unchanged library media is retained across versions.
    for (const key of await caches.keys()) {
      if (key === CORE_CACHE || key === ASSET_CACHE || key === TUTORIAL_CACHE) continue;
      if (key.startsWith('teacher-francis-reading-world-pwa-v') || key.startsWith('wonderquest-reading-world-pwa-v')) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

async function cacheOne(cache, url, { fresh = false } = {}) {
  try {
    const abs = absoluteURL(url);
    if (!fresh) {
      const existing = await cache.match(abs, { ignoreSearch: true });
      if (existing) return true;
    }
    const req = new Request(abs, { cache: fresh ? 'reload' : 'default' });
    const res = await fetch(req);
    if (!res || !res.ok) return false;
    await cache.put(abs, res.clone());
    return true;
  } catch (_) {
    return false;
  }
}

let fullLibraryPrecachePromise = null;

async function precacheReadingWorld() {
  const assetCache = await caches.open(ASSET_CACHE);
  const coreCache = await caches.open(CORE_CACHE);
  const immutablePending = [];
  const mutablePending = [];
  const coreURLs = new Set(CORE.map(absoluteURL));

  for (const url of OFFLINE_INVENTORY) {
    const abs = absoluteURL(url);
    if (isImmutableAssetURL(url)) {
      // Unchanged content-hashed files survive releases and require no network.
      if (!(await assetCache.match(abs, { ignoreSearch: true }))) immutablePending.push(url);
    } else if (!coreURLs.has(abs)) {
      // Module pages and other mutable files are refreshed once for this
      // release so offline mode receives current HTML/JS without redownloading
      // the media library.
      mutablePending.push(url);
    }
  }

  const jobs = [
    ...immutablePending.map(url => ({ url, cache: assetCache, fresh: false })),
    ...mutablePending.map(url => ({ url, cache: coreCache, fresh: true }))
  ];

  let cursor = 0;
  const failed = [];
  const workerCount = Math.min(4, Math.max(1, jobs.length));

  async function worker() {
    while (true) {
      const index = cursor++;
      if (index >= jobs.length) return;
      const job = jobs[index];
      if (!(await cacheOne(job.cache, job.url, { fresh: job.fresh }))) failed.push(job);
    }
  }

  await Promise.all(Array.from({ length: workerCount }, worker));

  // Retry transient failures once. If the device goes offline, pwa-register.js
  // asks us to fill any remaining gaps again when connectivity returns.
  let unresolved = failed;
  if (failed.length) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    let retryCursor = 0;
    const retryFailed = [];
    async function retryWorker() {
      while (true) {
        const index = retryCursor++;
        if (index >= failed.length) return;
        const job = failed[index];
        if (!(await cacheOne(job.cache, job.url, { fresh: job.fresh }))) retryFailed.push(job);
      }
    }
    await Promise.all(Array.from({ length: Math.min(3, failed.length) }, retryWorker));
    unresolved = retryFailed;
  }
  return { complete: unresolved.length === 0, cachedJobs: jobs.length, libraryItems: OFFLINE_INVENTORY.length };
}

async function notifyCacheComplete(result) {
  if (!result?.complete) return;
  const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  for (const client of windows) {
    client.postMessage({ type: 'READING_WORLD_CACHE_COMPLETE', cached_jobs: result.cachedJobs, library_items: result.libraryItems });
  }
}

function requestFullLibraryPrecache() {
  if (!fullLibraryPrecachePromise) {
    fullLibraryPrecachePromise = precacheReadingWorld().then(async result => {
      await notifyCacheComplete(result);
      return result;
    }).finally(() => {
      fullLibraryPrecachePromise = null;
    });
  }
  return fullLibraryPrecachePromise;
}

self.addEventListener('message', event => {
  if (event.data?.type === 'PRECACHE_READING_WORLD') event.waitUntil(requestFullLibraryPrecache());
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    // Pages are network-first so a newly published GitHub Pages release is
    // picked up promptly. The latest successful page is kept for offline use.
    if (req.mode === 'navigate') {
      try {
        const res = await fetch(req, { cache: 'no-cache' });
        if (res && res.ok) {
          const cache = await caches.open(CORE_CACHE);
          await cache.put(req, res.clone());
        }
        return res;
      } catch (_) {
        return (await caches.match(req, { ignoreSearch: true })) ||
               (await caches.match(absoluteURL('./index.html'))) ||
               (await caches.match(absoluteURL('./offline.html'))) || Response.error();
      }
    }

    // Installation tutorial videos/posters are optional and load on demand.
    // Once viewed, keep them in a stable cache so the guide can reopen quickly
    // without increasing WonderQuest's first-time offline-library download.
    if (url.pathname.includes('/shared/tutorials/')) {
      // Video elements may use byte-range requests. Let those pass through
      // untouched because Cache Storage cannot store 206 Partial Content.
      if (req.headers.has('range')) {
        try { return await fetch(req); } catch (_) { return Response.error(); }
      }
      const tutorialCache = await caches.open(TUTORIAL_CACHE);
      const cached = await tutorialCache.match(req, { ignoreSearch: true });
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res && res.ok && res.status === 200) await tutorialCache.put(req, res.clone());
        return res;
      } catch (_) {
        return Response.error();
      }
    }

    // Content-hashed library assets are cache-first and survive app versions.
    if (isImmutableAssetURL(req.url)) {
      const assetCache = await caches.open(ASSET_CACHE);
      const cached = await assetCache.match(req, { ignoreSearch: true });
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res && res.ok && CURRENT_ASSET_URLS.has(req.url)) await assetCache.put(req, res.clone());
        return res;
      } catch (_) {
        return Response.error();
      }
    }

    // Other files are network-first so shared scripts, module helpers, icons,
    // and manifest changes can update even when their filename stays the same.
    try {
      const res = await fetch(req, { cache: 'no-cache' });
      if (res && res.ok) {
        const cache = await caches.open(CORE_CACHE);
        await cache.put(req, res.clone());
      }
      return res;
    } catch (_) {
      const coreCache = await caches.open(CORE_CACHE);
      return (await coreCache.match(req, { ignoreSearch: true })) || Response.error();
    }
  })());
});
