document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DE NOTIFICAÇÃO (Sem alteração) ---
    const errorToast = document.getElementById('error-toast');
    const successToast = document.getElementById('success-toast');

    const setupToastClose = (toast) => {
        const closeButton = toast.querySelector('[data-dismiss="toast"]');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                toast.classList.add('hidden');
            });
        }
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 5000);
    };

    if (errorToast && errorToast.textContent.trim() !== '') {
        errorToast.classList.remove('hidden');
        setupToastClose(errorToast);
    }

    if (successToast && successToast.textContent.trim() !== '') {
        successToast.classList.remove('hidden');
        setupToastClose(successToast);
    }

    // --- GERENCIAMENTO DAS VISUALIZAÇÕES (Sem alteração) ---
    const homeView = document.getElementById('home-view');
    const agendarView = document.getElementById('agendar-view');
    const btnGotoAgendar = document.getElementById('btn-goto-agendar');
    const btnBackHome = document.getElementById('btn-back-home');

    btnGotoAgendar.addEventListener('click', () => {
        homeView.classList.add('hidden');
        agendarView.classList.remove('hidden');
        window.scrollTo(0, 0);
    });

    btnBackHome.addEventListener('click', () => {
        agendarView.classList.add('hidden');
        homeView.classList.remove('hidden');
    });

    // --- LÓGICA DO CALENDÁRIO (Com alterações de tema) ---
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthYear = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const scheduleForm = document.getElementById('schedule-form');
    const selectedDateInput = document.getElementById('selected-date-input');
    const formDateDisplay = document.getElementById('form-date-display');

    let currentDate = new Date();
    let selectedDate = null;

    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const ptBRMonths = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    function renderCalendar(date) {
        calendarGrid.innerHTML = '';
        const month = date.getMonth();
        const year = date.getFullYear();

        currentMonthYear.textContent = `${ptBRMonths[month]} de ${year}`;

        // [MUDANÇA] Dias da semana com cor ajustada para fundo escuro
        weekDays.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'font-semibold text-sm text-gray-400 pb-2'; // Era text-gray-500
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const firstDayOfWeek = firstDayOfMonth.getDay();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'p-2';
            calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const dayCell = document.createElement('div');
            const thisDate = new Date(year, month, day);
            const dayOfWeek = thisDate.getDay();
            const dateStr = thisDate.toISOString().split('T')[0];

            let classes = 'p-4 h-16 md:h-20 flex items-center justify-center rounded-lg border border-transparent transition-all duration-200';

            const isPast = thisDate < today;
            const isSelectable = (dayOfWeek === 2 || dayOfWeek === 4) && !isPast;

            if (isPast) {
                // [MUDANÇA] Dias passados para tema escuro
                classes += ' bg-gray-800 text-gray-600 cursor-not-allowed line-through';
            } else if (isSelectable) {
                // [MUDANÇA] Dias "Brasa": Laranja no hover
                classes += ' bg-gray-700 text-orange-400 hover:bg-orange-600 hover:text-white cursor-pointer';
                dayCell.dataset.date = dateStr;
            } else {
                // [MUDANÇA] Outros dias para tema escuro
                classes += ' text-gray-500';
            }

            if (selectedDate && thisDate.getTime() === selectedDate.getTime()) {
                // [MUDANÇA] Lógica de substituição atualizada para a nova classe base
                classes = classes.replace('bg-gray-700', 'bg-orange-600'); // Sobrescreve
                classes += ' bg-orange-600 text-white font-bold shadow-lg';
            }

            if (thisDate.getTime() === today.getTime() && !selectedDate) {
                classes += ' ring-2 ring-orange-500'; // "Hoje" já estava laranja
            }

            dayCell.className = classes;
            dayCell.textContent = day;
            calendarGrid.appendChild(dayCell);
        }
    }

    // --- EVENT LISTENERS DO CALENDÁRIO (Sem alteração) ---

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    calendarGrid.addEventListener('click', (e) => {
        const target = e.target;
        if (target.dataset.date) {
            const dateString = target.dataset.date;
            selectedDate = new Date(dateString + 'T00:00:00');

            selectedDateInput.value = dateString;
            formDateDisplay.textContent = selectedDate.toLocaleDateString('pt-BR', {
                weekday: 'long', day: 'numeric', month: 'long'
            });

            scheduleForm.classList.remove('hidden');
            renderCalendar(currentDate);
            scheduleForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    renderCalendar(currentDate);
});