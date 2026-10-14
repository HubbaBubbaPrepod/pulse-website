export const publicationDate = '2026-10-13';
export const guideContent = {
  'linux-server-monitoring': {
    ru: {
      title: 'Мониторинг Linux-сервера: установка Pulse и Go-агента',
      description:
        'Пошаговый запуск Pulse на Linux: готовые релизы, постоянный каталог данных, подключение агента и проверка метрик CPU, памяти и диска.',
      intro:
        'Для мониторинга Linux нужны два независимых процесса: Pulse Monitor хранит данные и отдаёт панель, а Pulse Agent собирает метрики на наблюдаемом узле. Они могут работать на одном сервере, но агент всё равно подключается отдельно.',
      sections: [
        {
          title: 'Подготовь сервер и скачай релиз',
          paragraphs: [
            'Выбери Linux amd64 или Linux arm64 по архитектуре машины. Готовый релиз уже содержит исполняемый файл: Go и Node.js для его запуска не нужны. Скачай архив Pulse Monitor и checksums.txt с одной страницы релиза. Проверь SHA-256 до распаковки.',
            'Распакуй бинарник вместе с каталогами out и deployment. out содержит статический интерфейс. Папку данных держи отдельно от out: там находятся учётная запись владельца, настройки серверов и журналы.',
          ],
          code: 'uname -m\nsha256sum pulse-monitor_*.tar.gz',
        },
        {
          title: 'Запусти монитор на локальном адресе',
          paragraphs: [
            'Выполни команду из каталога распакованного релиза. Адрес 127.0.0.1:8080 доступен только с самого сервера. Для первого входа на удалённый сервер используй SSH-туннель и открой локальный адрес туннеля в браузере.',
            'Создай аккаунт владельца до публикации панели. Используй один постоянный каталог данных для ручного запуска и будущей службы. Иначе служба может открыть новую пустую панель вместо существующей.',
          ],
          code: './pulse-monitor -addr 127.0.0.1:8080 -data ./data -static ./out',
        },
        {
          title: 'Подключи Linux-агент',
          paragraphs: [
            'В разделе «Серверы» добавь узел. Панель выдаст ID и токен: сохрани токен в отдельный файл agent.token. Скачай Pulse Agent для архитектуры наблюдаемого сервера. Для удалённой работы нужен HTTPS-адрес твоего монитора с доверенным сертификатом.',
            'Команда ниже содержит примеры адреса и ID: замени их значениями своей панели. agent-state хранит состояние агента и кэш коллекторов; не используй один каталог для разных узлов. ОС определяется автоматически.',
          ],
          code: './pulse-agent -url https://monitor.example.com:8443 -server SERVER_ID -token-file agent.token -state agent-state',
        },
        {
          title: 'Проверь метрики и настрой автозапуск',
          paragraphs: [
            'Узел должен перейти в online. Открой ресурсы и процессы: убедись, что приходят CPU, память и диски. Метрики GPU зависят от оборудования и драйверов; отсутствие GPU не является ошибкой подключения.',
            'Установщик службы монитора запускается из распакованного архива. Перед установкой останови ручной экземпляр. Каталог данных службы по умолчанию /var/lib/pulse-monitor; уже созданные данные нужно перенести согласно документации. Для агента используй установщик из его релиза.',
          ],
          code: 'sudo bash deployment/install-monitor.sh .\nsudo systemctl status pulse-monitor',
        },
        {
          title: 'Если сервер остаётся offline',
          paragraphs: [
            'Проверь URL, ID узла, файл токена, доверие TLS и исходящий доступ от агента к монитору. HTTP 401 обычно означает неверный или отозванный токен. Запусти pulse-agent -check для проверки окружения.',
            'Не запускай два агента с одним ID. Увеличение скорости обновления в интерфейсе не исправляет отсутствие отчётов агента. Сохраняй папку данных монитора в резервной копии перед обновлением.',
          ],
        },
      ],
    },
    en: {
      title: 'Linux server monitoring: install Pulse and the Go agent',
      description:
        'Deploy Pulse on Linux using release binaries, a persistent data directory and a Go agent. Verify CPU, memory, disk and process telemetry.',
      intro:
        'Linux monitoring uses two independent processes: Pulse Monitor stores telemetry and serves the dashboard, while Pulse Agent collects metrics on each node. They can share a machine, but the agent still connects separately.',
      sections: [
        {
          title: 'Choose your platform and download a release',
          paragraphs: [
            'Choose Linux amd64 or Linux arm64 for the machine architecture. Release binaries need neither Go nor Node.js to run. Download the Pulse Monitor archive and checksums.txt from the same release and verify SHA-256 before extraction.',
            'Keep the executable, out and deployment directories together. out contains the static interface. Store monitor data outside out: the data directory contains the owner account, node configuration and logs.',
          ],
          code: 'uname -m\nsha256sum pulse-monitor_*.tar.gz',
        },
        {
          title: 'Start the monitor on loopback',
          paragraphs: [
            'Run the command from the extracted archive. 127.0.0.1:8080 is reachable only on that host. For initial access to a remote server, use an SSH tunnel and open its local address in your browser.',
            'Create the owner account before publishing the dashboard. Use the same persistent data directory for manual startup and the future service; otherwise the service may start with an empty dashboard.',
          ],
          code: './pulse-monitor -addr 127.0.0.1:8080 -data ./data -static ./out',
        },
        {
          title: 'Connect a Linux agent',
          paragraphs: [
            'Add a node in Servers. Save its token in agent.token and download the matching Pulse Agent build. Remote operation requires your monitor’s HTTPS URL and a trusted certificate.',
            'Replace the example URL and SERVER_ID below with values from your dashboard. agent-state holds agent state and collector cache. Use a separate directory per node. The operating system is detected automatically.',
          ],
          code: './pulse-agent -url https://monitor.example.com:8443 -server SERVER_ID -token-file agent.token -state agent-state',
        },
        {
          title: 'Verify telemetry and enable startup',
          paragraphs: [
            'The node should become online. Open resources and processes and verify CPU, memory and disks. GPU metrics depend on hardware and drivers; an absent GPU is not a connection failure.',
            'Run the monitor service installer from its archive after stopping the manual process. The service defaults to /var/lib/pulse-monitor; migrate an existing data directory according to the installation documentation. Use the agent’s own service installer for the agent.',
          ],
          code: 'sudo bash deployment/install-monitor.sh .\nsudo systemctl status pulse-monitor',
        },
        {
          title: 'Troubleshoot an offline node',
          paragraphs: [
            'Check the URL, node ID, token file, trusted TLS and outbound connectivity from agent to monitor. HTTP 401 usually indicates an invalid or revoked token. Run pulse-agent -check to inspect the environment.',
            'Do not run two agents with one ID. A faster UI refresh cannot recover missing agent reports. Back up the monitor data directory before upgrades.',
          ],
        },
      ],
    },
    sources: ['monitor-install', 'agent'],
    related: ['multiple-server-monitoring', 'high-memory-processes'],
  },
  'windows-server-monitoring': {
    ru: {
      title: 'Мониторинг Windows: подключение Pulse Agent и автозапуск',
      description:
        'Подключи Windows-сервер к Pulse: отдельный токен узла, запуск агента, проверка процессов и установка службы Windows.',
      intro:
        'Windows-агент отправляет ресурсы, процессы, соединения и доступные журналы твоему Pulse Monitor. Панель может работать на Linux или Windows: операционные системы узлов не обязаны совпадать.',
      sections: [
        {
          title: 'Подготовь монитор и отдельный узел',
          paragraphs: [
            'Монитор должен быть доступен по HTTPS с сертификатом, которому доверяет Windows. Добавь сервер в панели и возьми его ID и токен. Выбор ОС при добавлении не требуется — агент сообщает её сам.',
            'Скачай Windows amd64 релиз Pulse Agent. Распакуй архив в постоянный каталог, например C:\\Pulse. Сохрани токен узла в C:\\Pulse\\agent.token и ограничь доступ к файлу учётными записями, которым он нужен.',
          ],
        },
        {
          title: 'Проверь агент в PowerShell',
          paragraphs: [
            'Перейди в каталог агента. URL и SERVER_ID в команде — примеры: подставь свои значения. Не помещай токен в опубликованные скриншоты, issue или историю команд.',
            'При успешном подключении узел станет online. В ресурсах появятся данные машины, а в процессах — доступные процессы Windows. Системные процессы могут требовать дополнительных прав; доступность данных зависит от контекста запуска агента.',
          ],
          code: '.\\pulse-agent.exe -url https://monitor.example.com:8443 -server SERVER_ID -token-file C:\\Pulse\\agent.token -state C:\\Pulse\\agent-state',
        },
        {
          title: 'Установи службу для запуска после перезагрузки',
          paragraphs: [
            'Останови ручной экземпляр и открой PowerShell с административными правами. Выполни установщик из архива агента. Он создаёт службу PulseAgent; проверь её состояние после установки.',
            'Учётная запись службы может иметь другой доступ к файлам и Docker Engine, чем пользователь интерактивной сессии. Проверь права на токен и каталог состояния именно для службы.',
          ],
          code: '.\\deployment\\install-agent.ps1 -PanelURL https://monitor.example.com:8443 -ServerID SERVER_ID -TokenFile C:\\Pulse\\agent.token -AgentExe C:\\Pulse\\pulse-agent.exe\nGet-Service PulseAgent',
        },
        {
          title: 'Что проверить при ошибке',
          paragraphs: [
            'Если ручной запуск работает, а служба нет, проверь пути, права службы и доверие сертификату в её окружении. Не отключай проверку TLS ради исправления ошибки. Для внутреннего CA установи его сертификат в подходящее доверенное хранилище.',
            'Если отдельных метрик нет, сначала уточни ограничения ОС и драйверов. Мониторинг GPU требует поддерживаемой видеокарты и драйверов. Наличие Docker Desktop само по себе не гарантирует доступ службы к выбранному Docker Engine.',
          ],
        },
      ],
    },
    en: {
      title: 'Windows server monitoring: connect Pulse Agent and its service',
      description:
        'Connect Windows to Pulse using a dedicated node token, verify process telemetry and install the Windows agent service.',
      intro:
        'The Windows agent sends resources, processes, connections and available logs to your Pulse Monitor. The monitor can run on Linux or Windows; nodes do not need to share its operating system.',
      sections: [
        {
          title: 'Prepare the monitor and a dedicated node',
          paragraphs: [
            'The monitor must be reachable over HTTPS with a certificate Windows trusts. Add a server in the dashboard and obtain its ID and token. The agent detects its OS automatically.',
            'Download the Windows amd64 agent release and extract it to a persistent directory such as C:\\Pulse. Save the node token in C:\\Pulse\\agent.token and restrict access to accounts that need it.',
          ],
        },
        {
          title: 'Verify the agent from PowerShell',
          paragraphs: [
            'Open the agent directory. Replace the example URL and SERVER_ID with your own values. Keep the token out of published screenshots, issues and command history.',
            'The node should become online. Resources show machine telemetry, and Processes lists accessible Windows processes. System processes may need additional privileges; the agent’s execution context determines access.',
          ],
          code: '.\\pulse-agent.exe -url https://monitor.example.com:8443 -server SERVER_ID -token-file C:\\Pulse\\agent.token -state C:\\Pulse\\agent-state',
        },
        {
          title: 'Install a service for startup after reboot',
          paragraphs: [
            'Stop the manual agent and open an administrative PowerShell session. Run the installer from the agent archive. It creates the PulseAgent service; verify its state after installation.',
            'The service account can have different file and Docker Engine access from your interactive user. Check token and state-directory permissions for the service account.',
          ],
          code: '.\\deployment\\install-agent.ps1 -PanelURL https://monitor.example.com:8443 -ServerID SERVER_ID -TokenFile C:\\Pulse\\agent.token -AgentExe C:\\Pulse\\pulse-agent.exe\nGet-Service PulseAgent',
        },
        {
          title: 'Diagnose missing data or connection errors',
          paragraphs: [
            'If a manual agent works but the service does not, check paths, service permissions and certificate trust in its environment. Keep TLS validation enabled. For an internal CA, install its certificate in the appropriate trust store.',
            'For missing metrics, check OS and driver limitations first. GPU monitoring needs supported hardware and drivers. Docker Desktop alone does not guarantee service access to the selected Docker Engine.',
          ],
        },
      ],
    },
    sources: ['agent'],
    related: ['linux-server-monitoring', 'multiple-server-monitoring'],
  },
  'multiple-server-monitoring': {
    ru: {
      title: 'Мониторинг нескольких серверов в одной панели Pulse',
      description:
        'Организуй мониторинг Linux и Windows: один монитор, отдельные агенты, уникальные токены узлов, хранение данных и проверка подключения.',
      intro:
        'Один Pulse Monitor может принимать данные нескольких Linux- и Windows-узлов. Монитор разворачивается централизованно, а агент запускается на каждом сервере. Публичный сайт Pulse не принимает эту телеметрию.',
      sections: [
        {
          title: 'Выбери расположение монитора',
          paragraphs: [
            'Размести монитор там, где агенты смогут подключаться к его HTTPS-адресу. Агенту нужен исходящий доступ к монитору; описание адреса сервера в панели не заменяет параметр -url агента.',
            'Подключай браузер к своему монитору, а не к отдельному агенту. Это разделяет отображение и сбор данных и позволяет использовать один интерфейс с компьютера, планшета или телефона.',
          ],
        },
        {
          title: 'Создай отдельную запись для каждого узла',
          paragraphs: [
            'Добавь сервер в разделе «Серверы», затем сохрани выданные ID и токен на этой машине. Для второго сервера повтори процесс — не копируй токен первого. У каждого агента должен быть собственный каталог состояния.',
            'Дай узлам понятные имена, которые помогут различать площадки и назначения. ОС определяется агентом автоматически. Не запускай несколько экземпляров агента с одной идентичностью: отчёты будут относиться к одной записи.',
          ],
        },
        {
          title: 'Проверь данные и обновление',
          paragraphs: [
            'Выбирай сервер в панели и проверяй время последнего отчёта, ресурсы, процессы и журналы. Выбранный сервер сохраняется между перезагрузками страницы, пока его запись существует.',
            'Интервал отображения в браузере и сбор агентом — разные вещи. Агент по умолчанию собирает каждые 500 ms; допустимый -interval — от 500 ms до 5 s. Режим realtime не делает недоступные метрики доступными и не гарантирует нулевую задержку сети.',
          ],
        },
        {
          title: 'Настрой модули и резервное копирование',
          paragraphs: [
            'Назначения модулей относятся к конкретному серверу. Один узел может использовать Docker-модуль с Unix socket, другой — с Windows named pipe, а третий — без Docker. Проверяй результат на каждом узле отдельно.',
            'Копируй постоянный каталог данных монитора и защищай резервную копию как исходные данные. Перед обновлением сохрани релиз и конфигурацию. При замене токена обнови файл на нужном агенте и перезапусти его.',
          ],
        },
        {
          title: 'Если один узел offline, а остальные работают',
          paragraphs: [
            'Сначала проверь проблемный агент: службу, URL, ID, токен, TLS и исходящий доступ. После 15 секунд без отчётов панель отмечает узел offline. Это говорит о свежести отчётов, а не само по себе о причине сбоя.',
            'Сравни ручной запуск со службой и проверь её права. Изменение фильтров интерфейса или интервала обновления не исправит отозванный токен или остановленную службу.',
          ],
        },
      ],
    },
    en: {
      title: 'Monitor multiple Linux and Windows servers with Pulse',
      description:
        'Use one self-hosted monitor with independent agents, unique node tokens, per-server modules and persistent telemetry storage.',
      intro:
        'One Pulse Monitor can receive telemetry from several Linux and Windows nodes. Host the monitor centrally and run an agent on each machine. The public Pulse website does not receive your telemetry.',
      sections: [
        {
          title: 'Choose where the monitor lives',
          paragraphs: [
            'Place the monitor where agents can reach its HTTPS URL. Agents need outbound access to that endpoint; a server address description in the dashboard does not replace the agent’s -url argument.',
            'Your browser connects to the monitor rather than an individual agent. This separates display from collection and gives you one interface for desktop, tablet and phone.',
          ],
        },
        {
          title: 'Create a unique identity per node',
          paragraphs: [
            'Add a server in Servers, then store its issued ID and token on that machine. Repeat for the next server instead of copying the first token. Each agent needs its own state directory.',
            'Choose names that distinguish locations and workloads. The OS is detected automatically. Avoid running multiple agents with one identity: their reports would belong to one node record.',
          ],
        },
        {
          title: 'Verify telemetry and update behavior',
          paragraphs: [
            'Select a server and check its latest report, resources, processes and logs. The selected server persists across reloads while its record exists.',
            'Browser display intervals differ from agent collection. The default agent interval is 500 ms; -interval accepts 500 ms through 5 s. Real-time display cannot recover unavailable metrics or eliminate network latency.',
          ],
        },
        {
          title: 'Configure modules and backups',
          paragraphs: [
            'Module assignments belong to individual servers. One node can use a Unix socket for Docker, another a Windows named pipe, and a third no Docker module. Verify module results separately on each node.',
            'Back up the monitor’s persistent data directory and protect the backup like the original data. Keep releases and configuration before upgrading. When rotating a token, update the appropriate agent token file and restart that agent.',
          ],
        },
        {
          title: 'Troubleshoot one offline node',
          paragraphs: [
            'Check the affected agent’s service, URL, ID, token, TLS and outbound connectivity first. The dashboard marks a node offline after 15 seconds without reports. That is a report freshness signal, not a diagnosis of the underlying problem.',
            'Compare manual execution with service execution and review permissions. Filters and refresh intervals cannot fix a revoked token or stopped service.',
          ],
        },
      ],
    },
    sources: ['agent', 'monitor-operations'],
    related: ['windows-server-monitoring', 'docker-container-monitoring'],
  },
  'docker-container-monitoring': {
    ru: {
      title: 'Мониторинг Docker-контейнеров в Pulse: CPU, память и логи',
      description:
        'Установи Docker-модуль Pulse и настрой socket или pipe. Разберись в CPU total, Memory total, сетевых счётчиках и логах контейнеров.',
      intro:
        'Docker-модуль — независимый JSON-пакет с нативным коллектором. Он добавляет данные контейнеров в Pulse без пересборки монитора и агента. Нужен работающий Docker Engine и доступ учётной записи агента к нему.',
      sections: [
        {
          title: 'Скачай и установи пакет',
          paragraphs: [
            'Скачай docker-module.json и checksums.txt из одного релиза модуля. Сверь SHA-256. В панели открой «Модули», загрузи JSON и назначь Docker нужному серверу. Для каждого другого узла создай отдельное назначение.',
            'Пакет содержит коллекторы Linux amd64, Linux arm64 и Windows amd64. Дополнительная установка Go или Node.js для его выполнения не нужна. Коллектор запускается с правами агента; устанавливай пакет из доверенного репозитория.',
          ],
          code: 'sha256sum docker-module.json\n# PowerShell:\nGet-FileHash ./docker-module.json -Algorithm SHA256',
        },
        {
          title: 'Настрой Docker Engine для выбранного узла',
          paragraphs: [
            'Поле socket можно оставить пустым для стандартного пути платформы. На Linux это /var/run/docker.sock, на Windows — \\\\.\\pipe\\docker_engine. Для rootless Docker укажи socket своего пользователя.',
            'Служба агента должна иметь доступ к выбранному socket или pipe. Доступ к Docker daemon привилегированный, даже если сам модуль делает запросы чтения. Не открывай Docker API в Интернет ради подключения модуля.',
          ],
        },
        {
          title: 'Правильно читай CPU total и Memory total',
          paragraphs: [
            'CPU рассчитывается по двум проходам статистики с интервалом в одну секунду. 100% означает одно полностью занятое ядро, поэтому значение выше 100% допустимо. Общий CPU относится к контейнерам, а не ко всем процессам хоста.',
            'Memory total — сумма используемой памяти работающих контейнеров, а не установленная RAM сервера. На Linux файловый кэш исключается. Если метрика работающего контейнера недоступна, соответствующая сумма показывается как неизвестная; тире не означает ноль.',
          ],
        },
        {
          title: 'Различай сеть, журналы и историю',
          paragraphs: [
            'Сетевые значения модуля — накопительные счётчики входящих и исходящих байтов, а не текущая скорость. Для скорости интерфейсов хоста используй основной сетевой мониторинг Pulse.',
            'В logContainer укажи ID нужного контейнера длиной минимум 12 символов. Модуль получает последние 50 строк; это не полный архив. Графики держат последние измерения в текущем просмотре. Список контейнеров ограничен 100, а truncated сообщает об ограничении.',
          ],
        },
        {
          title: 'Проверь ошибки на каждом сервере',
          paragraphs: [
            'При error проверь доступность движка, путь socket или pipe, права службы и ID контейнера. Отсутствие журналов может зависеть от logging driver. unsupported означает отсутствие подходящего бинарника для платформы.',
            'Обновляй модуль новой версией пакета и проверяй результат на каждом назначенном узле. Не заменяй содержимое уже выпущенной версии: монитор отклоняет конфликт одного ID и версии с разными бинарниками.',
          ],
        },
      ],
    },
    en: {
      title: 'Docker container monitoring with Pulse: CPU, memory and logs',
      description:
        'Install the Pulse Docker module, configure its socket or pipe, and interpret total CPU, working-set memory, network counters and logs.',
      intro:
        'The independent Docker module is a JSON package with a native collector. It adds container telemetry without rebuilding the monitor or agent. You need a running Docker Engine and access from the agent account.',
      sections: [
        {
          title: 'Download and install the package',
          paragraphs: [
            'Download docker-module.json and checksums.txt from the same module release and verify SHA-256. Upload the JSON through Modules and assign Docker to a server. Create separate assignments for other nodes.',
            'The package contains Linux amd64, Linux arm64 and Windows amd64 collectors. Go and Node.js are not needed to execute them. The collector inherits the agent’s permissions, so use a trusted source.',
          ],
          code: 'sha256sum docker-module.json\n# PowerShell:\nGet-FileHash ./docker-module.json -Algorithm SHA256',
        },
        {
          title: 'Configure the selected Docker Engine',
          paragraphs: [
            'Leave socket empty for the platform default: /var/run/docker.sock on Linux or \\\\.\\pipe\\docker_engine on Windows. For rootless Docker, specify the user’s socket.',
            'The agent service must be able to access that socket or pipe. Docker daemon access is privileged even though this collector only reads data. Do not publish Docker API to the Internet for this module.',
          ],
        },
        {
          title: 'Interpret total CPU and total memory',
          paragraphs: [
            'CPU uses two statistics passes one second apart. 100% represents one fully occupied core, so values above 100% are possible. Total CPU describes containers, not every host process.',
            'Memory total sums running-container working-set memory rather than installed host RAM. Linux file cache is excluded. If a running container metric is unavailable, its corresponding total stays unknown; a dash does not mean zero.',
          ],
        },
        {
          title: 'Understand network, logs and history',
          paragraphs: [
            'Module network values are cumulative received and transmitted byte counters, not current rates. Use the main Pulse network view for host interface rates.',
            'Set logContainer to a container ID of at least 12 characters. The module reads the latest 50 lines rather than a full archive. Charts keep recent measurements in the current view. The container list is limited to 100; truncated indicates that limit.',
          ],
        },
        {
          title: 'Diagnose each server independently',
          paragraphs: [
            'For error, check Engine availability, the socket or pipe path, service permissions and container ID. Logging drivers can limit logs. unsupported means a suitable platform binary is absent.',
            'Upload a new package version for upgrades and verify every assigned node. Do not replace a released version’s contents: the monitor rejects conflicting binaries under the same ID and version.',
          ],
        },
      ],
    },
    sources: ['docker', 'monitor-modules'],
    related: ['multiple-server-monitoring', 'high-memory-processes'],
  },
  'high-memory-processes': {
    ru: {
      title: 'Как найти процесс, который расходует память на сервере',
      description:
        'Разбери высокое потребление RAM в Pulse: сортировка процессов, сравнение с общей памятью, наблюдение во времени и проверка результата.',
      intro:
        'Высокая занятость RAM не всегда означает утечку. Pulse помогает отделить память отдельных процессов от общей картины хоста. Сначала найди потребителя и посмотри изменение во времени, затем принимай решение о настройке приложения.',
      sections: [
        {
          title: 'Выбери сервер и проверь свежесть данных',
          paragraphs: [
            'Убедись, что выбран нужный сервер и его агент online. Смотри время отчёта: старый список процессов не показывает текущее состояние машины. Изменение интервала в интерфейсе регулирует отображение, а не доступ агента к данным.',
            'В ресурсах сравни общий объём RAM, использованную память и историю. На Linux часть памяти может занимать файловый кэш. Значение used у хоста и сумма строк процессов не обязаны совпадать.',
          ],
        },
        {
          title: 'Отсортируй процессы по памяти',
          paragraphs: [
            'Открой «Процессы» и выбери сортировку по памяти по убыванию. Сопоставь имя и PID первых строк с приложениями, которые должны работать на сервере. Не определяй назначение процесса только по короткому имени.',
            'Проверь CPU рядом с памятью. Высокие RAM и CPU могут сопровождать нормальную тяжёлую задачу. Процесс с низким CPU тоже может держать много памяти, например база данных с буферами.',
          ],
        },
        {
          title: 'Наблюдай рост, а не одно измерение',
          paragraphs: [
            'Проверь несколько последовательных обновлений под сопоставимой нагрузкой. Рост памяти без стабилизации — повод исследовать приложение, но одного снимка недостаточно для диагноза утечки.',
            'PID может измениться после перезапуска, а ОС может использовать прежний PID повторно. Сравнивай имя, сервер и момент наблюдения. Если список неполный, проверь права агента и ограничения ОС.',
          ],
        },
        {
          title: 'Если приложение работает в Docker',
          paragraphs: [
            'Перейди в Docker-модуль того же сервера и сравни память контейнеров. Memory total описывает работающие контейнеры, а не всю память хоста; на Linux модуль исключает файловый кэш.',
            'Сетевые счётчики и последние журналы контейнера помогают понять, что происходило одновременно с ростом памяти. Модуль получает только последние 50 строк выбранного контейнера, поэтому полный журнал приложения ищи в его собственном хранилище.',
          ],
        },
        {
          title: 'Подтверди причину и результат изменения',
          paragraphs: [
            'Изучи настройки и журналы конкретного приложения: лимиты, буферы, параллелизм и характер задач. Не завершай неизвестный системный процесс только потому, что он оказался первым в таблице.',
            'После изменения настройки повтори наблюдение под похожей нагрузкой. Сравни память процесса и хоста, доступность приложения и новые события. Это подтверждает результат лучше, чем уменьшение одной цифры после перезапуска.',
          ],
        },
      ],
    },
    en: {
      title: 'Find high-memory processes on your server with Pulse',
      description:
        'Investigate RAM usage with process sorting, host memory history, repeated observations and Docker container metrics.',
      intro:
        'High RAM usage does not automatically mean a leak. Pulse helps separate process memory from the host’s overall state. Find the consumer, observe it over time, then investigate the application’s configuration.',
      sections: [
        {
          title: 'Select the server and verify fresh data',
          paragraphs: [
            'Confirm the correct server and an online agent. Check report freshness: an old process list does not describe the current machine. UI refresh settings control display rather than agent permissions.',
            'Compare total RAM, used memory and history in Resources. Linux file cache can occupy a substantial share. Host used memory and the sum of process rows need not match.',
          ],
        },
        {
          title: 'Sort processes by memory',
          paragraphs: [
            'Open Processes and sort memory descending. Match the names and PIDs at the top to expected workloads. A short process name alone does not establish its purpose.',
            'Check CPU alongside memory. High CPU and RAM can be normal during a heavy job. A low-CPU process can also retain significant memory, such as database buffers.',
          ],
        },
        {
          title: 'Observe growth rather than one sample',
          paragraphs: [
            'Compare several updates under similar workload. Memory that keeps growing without stabilizing warrants investigation, but one snapshot cannot establish a leak.',
            'PIDs change after restarts and can be reused by the OS. Compare the process name, server and observation time. For incomplete lists, check agent permissions and OS limitations.',
          ],
        },
        {
          title: 'Inspect Docker workloads separately',
          paragraphs: [
            'Open the Docker module for the same node and compare container memory. Memory total covers running containers rather than all host RAM, excluding Linux file cache.',
            'Network counters and recent container logs can help correlate activity with memory growth. The module reads only 50 recent lines from the selected container; use the application’s own log storage for its full history.',
          ],
        },
        {
          title: 'Confirm both the cause and the outcome',
          paragraphs: [
            'Review the application’s logs and configuration: limits, buffers, concurrency and workload. Do not terminate an unfamiliar system process just because it tops the table.',
            'After a configuration change, observe a comparable workload again. Check process and host memory, application availability and new events. That is stronger evidence than one smaller number after restarting.',
          ],
        },
      ],
    },
    sources: ['agent', 'docker'],
    related: ['docker-container-monitoring', 'multiple-server-monitoring'],
  },
};
guideContent['create-pulse-module'] = {
  ru: {
    title: 'Как создать собственный модуль для Pulse Monitor',
    description:
      'Контракт нативного коллектора Pulse: stdin и stdout JSON, манифест интерфейса, платформенные бинарники, SHA-256 и установка пакета.',
    intro:
      'Модуль состоит из JSON-манифеста интерфейса и самостоятельного исполняемого коллектора. Монитор не загружает произвольный JavaScript автора: карточки, таблицы, графики и журналы строятся из декларативных представлений.',
    sections: [
      {
        title: 'Определи данные и настройки',
        paragraphs: [
          'Выбери одну задачу коллектора: например, прочитать состояние локального сервиса. В манифесте задай уникальный id, версию, описание и автора. В fields опиши настройки пользователя: text, password, number или boolean.',
          'Поля permissions описывают доступ для оператора, но не ограничивают процесс на уровне ОС. Коллектор работает с правами агента, поэтому сразу определи, какие файлы, сокеты или службы он будет читать.',
        ],
      },
      {
        title: 'Реализуй контракт процесса',
        paragraphs: [
          'Агент передаёт один JSON-объект в stdin: protocol равен 1, а config содержит сохранённые настройки. Коллектор возвращает ровно один JSON-объект в stdout и завершается с кодом 0. Диагностику отправляй в stderr.',
          'Для проверки сначала передай коллектору тестовый JSON вручную. Вывод состояния в виде {"service":{"status":"running"}} подходит для карточки service с колонкой status. Не смешивай журнал запуска с JSON-результатом.',
        ],
        code: 'Вход:  {"protocol":1,"config":{"endpoint":"local-service"}}\nВыход: {"service":{"status":"running"}}',
      },
      {
        title: 'Опиши интерфейс в манифесте',
        paragraphs: [
          'Пакет использует schemaVersion: 1 и protocol: 1. В views добавь kind, title и key верхнего поля результата. Для cards значение является объектом; для table — массивом объектов; для chart — объектом числовых значений; для logs — массивом сообщений.',
          'Колонки описывают key, label и необязательный unit. Если key представления не совпадает с полем результата, панель не найдёт данные. Проверь манифест на небольшом примере до подключения реального сервиса.',
        ],
      },
      {
        title: 'Собери и упакуй бинарники',
        paragraphs: [
          'В binaries используются ключи linux-amd64, linux-arm64 и windows-amd64. Для каждого доступного бинарника укажи content с base64 его байтов и sha256 с SHA-256 этих же байтов. Формат и архитектура файла должны совпадать с ключом.',
          'Лимит бинарника — 16 MiB, суммарно — 48 MiB. stdout коллектора ограничен 512 KiB. Скачивание и запуск одного модуля разделяют бюджет 5 секунд, поэтому медленные запросы должны иметь собственный таймаут и компактный результат.',
        ],
      },
      {
        title: 'Проверь пакет на отдельных узлах',
        paragraphs: [
          'Загрузи JSON в раздел «Модули» своего монитора и назначь тестовому серверу. Проверь настройки, видимость результата, ошибки, недоступность сервиса и поддержку каждой заявленной платформы. Docker-модуль можно изучить как рабочий пример независимого репозитория и упаковки.',
          'При изменении бинарников увеличивай version: конфликт содержимого существующей версии отклоняется. Публикуй код, релиз и checksums отдельно от токенов и приватной конфигурации. Полноценная публикация модулей через сайт пока не реализована; распространяй пакет через свой репозиторий.',
        ],
      },
    ],
  },
  en: {
    title: 'Build your own module for Pulse Monitor',
    description:
      'Learn the native Pulse collector contract, JSON stdin and stdout, declarative views, platform binaries, SHA-256 and package installation.',
    intro:
      'A module contains a JSON UI manifest and a standalone executable collector. The monitor does not load arbitrary author JavaScript: cards, tables, charts and logs are generated from declarative views.',
    sections: [
      {
        title: 'Define data and configuration',
        paragraphs: [
          'Give the collector a focused task, such as reading local service status. Choose a unique id, version, description and author in the manifest. fields describes user settings of type text, password, number or boolean.',
          'permissions describes access for the operator; it does not enforce OS restrictions. The collector inherits agent privileges, so identify the files, sockets and services it needs.',
        ],
      },
      {
        title: 'Implement the process contract',
        paragraphs: [
          'The agent sends one JSON object on stdin with protocol: 1 and saved settings in config. The collector must return exactly one JSON object on stdout and exit with code 0. Send diagnostics to stderr.',
          'Start by feeding a test input manually. {"service":{"status":"running"}} can feed a service card with a status column. Keep startup logs out of the JSON result.',
        ],
        code: 'Input:  {"protocol":1,"config":{"endpoint":"local-service"}}\nOutput: {"service":{"status":"running"}}',
      },
      {
        title: 'Describe the interface',
        paragraphs: [
          'The package uses schemaVersion: 1 and protocol: 1. Add kind, title and the result’s top-level key in views. cards uses an object, table an array of objects, chart an object of numeric values, and logs an array of messages.',
          'Columns specify key, label and optional unit. A mismatched view key prevents the dashboard from finding its data. Verify the manifest with a small sample before connecting a real service.',
        ],
      },
      {
        title: 'Build and package native executables',
        paragraphs: [
          'binaries uses linux-amd64, linux-arm64 and windows-amd64 keys. Each supported executable needs its bytes as base64 content and their SHA-256 in sha256. File format and architecture must match the platform key.',
          'An executable is limited to 16 MiB and total binaries to 48 MiB. Collector stdout is limited to 512 KiB. Download and execution share a five-second budget, so give slow requests their own timeout and return compact data.',
        ],
      },
      {
        title: 'Validate on separate nodes',
        paragraphs: [
          'Upload the JSON through Modules in your own monitor and assign it to a test server. Check configuration, displayed results, errors, an unavailable target service and each declared platform. The independent Docker repository demonstrates a working collector and packaging.',
          'Increment version when executables change: conflicting contents under an existing version are rejected. Publish source, a release and checksums separately from tokens and private settings. Website-based module submissions are not implemented yet; distribute packages from your own repository.',
        ],
      },
    ],
  },
  sources: ['monitor-modules', 'docker'],
  related: ['docker-container-monitoring', 'multiple-server-monitoring'],
};
export const guideSlugs = Object.keys(guideContent);
