import quizQuestions from './kahoot_questions.js';

class QuizGame {
    constructor() {
        this.questions = quizQuestions;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timer = null;
        this.timeLeft = 0;
        
        // DOM元素
        this.questionElement = document.getElementById('question');
        this.optionsContainer = document.getElementById('options');
        this.timerElement = document.getElementById('timer');
        this.scoreElement = document.getElementById('score');
        
        this.initGame();
    }

    initGame() {
        this.showQuestion();
        this.updateScore();
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endGame();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        this.questionElement.textContent = question.question;
        
        // 清空选项容器
        this.optionsContainer.innerHTML = '';
        
        // 创建选项按钮
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option-button');
            button.addEventListener('click', () => this.checkAnswer(index));
            this.optionsContainer.appendChild(button);
        });

        // 设置计时器
        this.timeLeft = question.timeLimit;
        this.startTimer();
    }

    startTimer() {
        this.updateTimerDisplay();
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        this.timerElement.textContent = `剩余时间: ${this.timeLeft}秒`;
    }

    checkAnswer(selectedIndex) {
        clearInterval(this.timer);
        const currentQuestion = this.questions[this.currentQuestionIndex];
        
        if (selectedIndex === currentQuestion.correctAnswer) {
            this.score += Math.floor(this.timeLeft * 100 / currentQuestion.timeLimit);
            this.updateScore();
        }

        this.currentQuestionIndex++;
        setTimeout(() => this.showQuestion(), 1000);
    }

    timeUp() {
        clearInterval(this.timer);
        this.currentQuestionIndex++;
        this.showQuestion();
    }

    updateScore() {
        this.scoreElement.textContent = `得分: ${this.score}`;
    }

    endGame() {
        this.questionElement.textContent = `游戏结束！最终得分: ${this.score}`;
        this.optionsContainer.innerHTML = '';
        this.timerElement.textContent = '';
    }
}

// 当页面加载完成时初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new QuizGame();
}); 