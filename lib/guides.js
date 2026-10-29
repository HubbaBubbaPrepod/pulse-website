export const publicationDate = '2026-10-29';
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
        'Docker 3 добавляет список контейнеров с ID, нагрузку CPU и памяти, сетевые счётчики, логи выбранного контейнера и действия управления. WASI-компонент работает через посредника агента с отдельными разрешениями. Нужны Monitor 0.7.0 и Agent 0.6.0 или совместимые более новые версии.',
      sections: [
        {
          title: 'Выбери и установи версию',
          paragraphs: [
            'Открой страницу Docker в Marketplace и проверь runtime, совместимость, источник и SHA-256. Для Docker 3 выбери WASI. Старые нативные версии требуют полного доверия.',
            'Установи пакет из включённого каталога Monitor или скачай JSON и импортируй вручную. Второй вариант работает без внешнего каталога. Назначь компонент каждому нужному узлу отдельно.',
          ],
        },
        {
          title: 'Выдай только необходимый доступ',
          paragraphs: [
            'Включи компонент на выбранном узле. docker.read разрешает чтение; docker.logs — логи. Для запуска, остановки и перезапуска нужны docker.control и actions.execute. Смена runtime требует повторного согласия.',
            'Гость не получает Docker socket. Служба агента должна иметь доступ к локальному Unix socket или Windows named pipe. Этот доступ остаётся привилегированным на стороне посредника; не открывай Docker API в Интернет.',
          ],
        },
        {
          title: 'Разберись в показателях',
          paragraphs: [
            'CPU 100% означает одно занятое ядро: значение выше 100% допустимо. Memory total — используемая память работающих контейнеров, а не RAM хоста. На Linux файловый кэш исключается. Неизвестная метрика показывается как неизвестная, а не как ноль.',
            'Сеть показывает накопительные счётчики, а не скорость интерфейса. Список ограничен 100 контейнерами; truncated сообщает об ограничении. Графики содержат последние измерения текущего просмотра.',
          ],
        },
        {
          title: 'Открой логи нужного контейнера',
          paragraphs: [
            'В таблице выбери контейнер и открой его логи. Запрос относится к выбранному ID; менять контейнер в общих настройках для каждого просмотра не требуется. Это ограниченный хвост журнала, а не полный архив.',
            'Логи могут содержать секреты приложений. Выдавай доступ осознанно и не публикуй снимки с адресами, токенами или внутренними именами.',
          ],
        },
        {
          title: 'Проверь результат управления',
          paragraphs: [
            'Запуск, остановка и перезапуск доступны только с отдельными разрешениями. После команды проверяется реальное состояние контейнера; при настроенном Docker healthcheck учитывается и здоровье. Running само по себе не гарантирует готовность приложения.',
            'Если связь оборвалась или результат неизвестен, сначала перечитай состояние. Не повторяй изменение автоматически: квитанция и проверка состояния не дают гарантии «ровно один раз». Проверяй действия на тестовом контейнере.',
          ],
        },
      ],
    },
    en: {
      title: 'Docker container monitoring with Pulse: CPU, memory and logs',
      description:
        'Install the Pulse Docker module, configure its socket or pipe, and interpret total CPU, working-set memory, network counters and logs.',
      intro:
        'Docker 3 adds container IDs, CPU and memory metrics, network counters, selected-container logs and control actions. Its WASI component uses the Agent broker with separate grants. Use Monitor 0.7.0 and Agent 0.6.0 or compatible newer versions.',
      sections: [
        {
          title: 'Choose and install a version',
          paragraphs: [
            'Open Docker in Marketplace and check runtime, compatibility, source and SHA-256. Choose WASI for Docker 3; older native versions require full trust.',
            'Install through an enabled Monitor catalog or download JSON and import it manually with Marketplace disabled. Assign the component separately to each target node.',
          ],
        },
        {
          title: 'Grant only the required access',
          paragraphs: [
            'Enable the component on a node. docker.read allows reads and docker.logs allows logs. Start, stop and restart require docker.control and actions.execute. A runtime change requires renewed consent.',
            'The guest never receives the Docker socket. The Agent service needs access to the local Unix socket or Windows named pipe. Broker access remains privileged; never expose the Docker API to the Internet.',
          ],
        },
        {
          title: 'Read the metrics correctly',
          paragraphs: [
            'CPU 100% represents one busy core, so higher values are valid. Memory total is working-container memory, not host RAM. Linux file cache is excluded. Unavailable metrics remain unknown instead of becoming zero.',
            'Network values are cumulative counters, not interface rates. The list is limited to 100 containers and truncated indicates that limit. Charts contain recent measurements from the current view.',
          ],
        },
        {
          title: 'Open logs for a selected container',
          paragraphs: [
            'Choose a table row and open its logs. The request targets that container ID without repeatedly editing shared module settings. This is a bounded log tail, not a complete archive.',
            'Logs can contain application secrets. Grant access deliberately and remove addresses, tokens and internal names from published screenshots.',
          ],
        },
        {
          title: 'Verify control results',
          paragraphs: [
            'Start, stop and restart require separate grants. After a command, the actual container state is checked; a configured Docker healthcheck is also considered. Running does not itself prove application readiness.',
            'After a disconnect or unknown outcome, read the state before retrying a mutation. Receipts and postcondition checks do not guarantee exactly-once execution. Test with a disposable container.',
          ],
        },
      ],
    },
    sources: ['docker', 'monitor-wasi', 'monitor-modules'],
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
  'create-pulse-module': {
    ru: {
      title: 'Как создать модуль для Pulse: WASI, разрешения и публикация',
      description:
        'Контракт модулей Pulse: выбор WASI или нативного runtime, посредник разрешений, декларативный интерфейс и публикация через GitHub и Marketplace.',
      intro:
        'Пакет объединяет JSON-манифест и исполняемые компоненты для Agent или Monitor. Для изоляции используй WASI. Нативный runtime остаётся вариантом полного доверия. Интерфейс строится из декларативных представлений, без JavaScript автора.',
      sections: [
        {
          title: 'Выбери задачу и место выполнения',
          paragraphs: [
            'Компонент может собирать данные на Agent или выполнять работу на Monitor. Используй схему пакета 2 и поддерживаемые ручные или периодические триггеры. Не считай произвольное объявление возможности готовой реализацией: сверяйся с контрактом установленного хоста.',
            'Дай пакету уникальный id и версию. Раздели необходимые разрешения requires и дополнительные optionalCapabilities. Управление контейнерами должно запрашиваться отдельно от чтения.',
          ],
        },
        {
          title: 'Собери изолированный WASI-компонент',
          paragraphs: [
            'Укажи runtime: wasip1 и один артефакт binaries["wasip1-wasm"] с base64 и SHA-256. Для Go используй GOOS=wasip1 и GOARCH=wasm. PE или ELF нельзя выдавать за WASI.',
            'Гость не получает каталоги, окружение, сокеты или запуск процессов хоста. Docker socket и секреты остаются у посредника. Для необходимых операций используй только реализованный API посредника и явно выданные разрешения.',
          ],
          code: 'GOOS=wasip1 GOARCH=wasm go build -o module.wasm ./cmd/module',
        },
        {
          title: 'Реализуй протокол и интерфейс',
          paragraphs: [
            'Следуй контракту MODULES-V2 и MODULES-WASI в документации Monitor: обработка одного JSON-входа, ограниченный JSON-выход и доступ к посреднику. Используй пример актуального Docker-модуля. Не смешивай диагностические сообщения с результатом.',
            'Карточки, таблицы, графики и логи описываются в views. Сопоставь ключи представлений с реальным результатом и обрабатывай неизвестные метрики отдельно от нулевых. Ручные действия должны проверять конечное состояние, а не только код завершения команды.',
          ],
        },
        {
          title: 'Проверь ограничения и отказы',
          paragraphs: [
            'Для WASI действуют ограничения: артефакт 16 MiB, вход 2 MiB, линейная память 128 MiB, запуск до 30 секунд вместе с ожиданием, stdout и ответ посредника 512 KiB. Это не квота всего RSS или CPU процесса хоста.',
            'Проверь отказ без разрешения, недоступность сервиса, таймаут, неверный JSON и все заявленные платформы. Нативный runtime запускается с правами хоста и не получает файловую песочницу; это должно быть понятно до установки.',
          ],
        },
        {
          title: 'Опубликуй версию через Marketplace',
          paragraphs: [
            'Размести исходники в публичном GitHub-репозитории, добавь topic pulse-module и файл pulse-marketplace.json. Создай GitHub Release с JSON-пакетом; маленький маркер обнаружения не заменяет пакет с артефактами.',
            'Каждая версия проходит автоматическую проверку и отдельное одобрение модератора. Публикация закрепляется за точными байтами и SHA-256. При изменении пакета выпускай новую версию. Установить пакет можно из включённого каталога Monitor или вручную загрузить JSON без подключения к Marketplace.',
            'Смена runtime или запрошенных возможностей отключает компонент до повторной выдачи разрешений. Совместимое обновление сохраняет настройки. Никогда не включай рабочие токены и секреты в релиз.',
          ],
        },
      ],
    },
    en: {
      title: 'Build a Pulse module: WASI, permissions and publishing',
      description:
        'The Pulse module contract: WASI and native runtimes, broker permissions, declarative views, and publishing through GitHub and Marketplace.',
      intro:
        'A package combines a JSON manifest and executable components for Agent or Monitor. Choose WASI for isolation; native execution remains a full-trust option. Views are declarative and do not run author-supplied JavaScript.',
      sections: [
        {
          title: 'Choose a task and execution location',
          paragraphs: [
            'A component can collect data on Agent or run on Monitor. Use package schema 2 and supported manual or interval triggers. Declaring a capability does not implement it: check the installed host contract.',
            'Choose a unique package id and version. Separate requires from optionalCapabilities. Container control must be requested separately from read access.',
          ],
        },
        {
          title: 'Build an isolated WASI component',
          paragraphs: [
            'Set runtime to wasip1 and provide one binaries["wasip1-wasm"] artifact with base64 content and SHA-256. Build Go with GOOS=wasip1 and GOARCH=wasm; do not label a PE or ELF binary as WASI.',
            'Host directories, environment, sockets and process creation are unavailable to the guest. Docker sockets and secrets stay in the broker. Use implemented broker operations with explicit grants.',
          ],
          code: 'GOOS=wasip1 GOARCH=wasm go build -o module.wasm ./cmd/module',
        },
        {
          title: 'Implement the protocol and views',
          paragraphs: [
            'Follow MODULES-V2 and MODULES-WASI in the Monitor documentation: one JSON input, bounded JSON output and the broker contract. Use the current Docker module as a reference. Keep diagnostics out of the result.',
            'Describe cards, tables, charts and logs in views. Match view keys to real results and distinguish unavailable values from zero. Manual actions must verify their postcondition instead of relying only on command exit status.',
          ],
        },
        {
          title: 'Test limits and failures',
          paragraphs: [
            'WASI limits include a 16 MiB artifact, 2 MiB input, 128 MiB linear memory, a 30-second deadline including queue wait, and 512 KiB stdout and broker responses. These are not whole-process RSS or CPU quotas.',
            'Test denied grants, an unavailable service, timeouts, invalid JSON and all declared platforms. Native execution inherits host privileges without a filesystem sandbox; disclose that before installation.',
          ],
        },
        {
          title: 'Publish through Marketplace',
          paragraphs: [
            'Publish source in a public GitHub repository, add the pulse-module topic and pulse-marketplace.json marker, then create a GitHub Release with the install JSON. A discovery marker is not the package containing executable artifacts.',
            'Every version requires automatic validation and a separate moderator decision. Publication binds exact bytes and SHA-256. Release a new version whenever bytes change. Install through an enabled Monitor catalog or import JSON manually without connecting to Marketplace.',
            'Changing runtime or requested capabilities disables the component until grants are renewed. Compatible updates preserve settings. Never include live tokens or secrets in releases.',
          ],
        },
      ],
    },
    sources: ['monitor-modules', 'monitor-wasi', 'marketplace-modules', 'docker'],
    related: ['docker-container-monitoring', 'multiple-server-monitoring'],
  },
};
export const guideSlugs = Object.keys(guideContent);
