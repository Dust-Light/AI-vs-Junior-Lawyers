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
        this.questionElement.textContent = `${this.currentQuestionIndex + 1}. ${question.question}`;
        
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
        clearInterval(this.timer);
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
        const buttons = this.optionsContainer.getElementsByClassName('option-button');
        
        // 禁用所有按钮
        Array.from(buttons).forEach(button => {
            button.disabled = true;
        });

        // 显示正确和错误答案
        buttons[currentQuestion.correctAnswer].classList.add('correct');
        if (selectedIndex !== currentQuestion.correctAnswer) {
            buttons[selectedIndex].classList.add('incorrect');
        }
        
        if (selectedIndex === currentQuestion.correctAnswer) {
            this.score += Math.floor(this.timeLeft * 100 / currentQuestion.timeLimit);
            this.updateScore();
        }

        setTimeout(() => {
            this.currentQuestionIndex++;
            this.showQuestion();
        }, 2000);
    }

    timeUp() {
        clearInterval(this.timer);
        const buttons = this.optionsContainer.getElementsByClassName('option-button');
        Array.from(buttons).forEach(button => {
            button.disabled = true;
        });
        
        // 显示正确答案
        const currentQuestion = this.questions[this.currentQuestionIndex];
        buttons[currentQuestion.correctAnswer].classList.add('correct');
        
        setTimeout(() => {
            this.currentQuestionIndex++;
            this.showQuestion();
        }, 2000);
    }

    updateScore() {
        this.scoreElement.textContent = `得分: ${this.score}`;
    }

    endGame() {
        const container = document.getElementById('game-container');
        container.innerHTML = `
            <div class="game-over">
                <h2>游戏结束！</h2>
                <p>最终得分: ${this.score}</p>
                <button class="restart-button" onclick="location.reload()">重新开始</button>
            </div>
        `;
    }
}

// 当页面加载完成时初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new QuizGame();
}); 