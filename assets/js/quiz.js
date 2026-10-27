// Self-check quiz: instant feedback, running score, reset.
(function () {
  var QUESTIONS = [
    {
      topic: "Table setting",
      q: "Which side of your place setting does the bread plate go on?",
      options: ["Left, above the forks", "Right, beside the knife", "Directly in front of the dinner plate", "Anywhere that has space"],
      answer: 0,
      why: "Remember BMW: Bread on the left, Meal in the middle, Water on the right. Your drinks sit on the right."
    },
    {
      topic: "Table setting",
      q: "There are three forks beside your plate. Which one do you pick up first?",
      options: ["The one closest to the plate", "The outermost fork", "Whichever looks the cleanest", "The smallest one"],
      answer: 1,
      why: "Work from the outside in. Utensils are laid out in the order the courses will arrive."
    },
    {
      topic: "Napkin",
      q: "When should the napkin go on your lap?",
      options: ["Right after you sit down, following your host's lead", "Only once the food arrives", "Tucked into your collar", "It stays on the table until dessert"],
      answer: 0,
      why: "Put it in your lap soon after sitting and use it to dab your mouth. If you step away, leave it on your chair, not on the table."
    },
    {
      topic: "Ordering",
      q: "What is the safest thing to order at a business meal?",
      options: ["The most expensive dish, to show confidence", "A messy dish like ribs or spaghetti with red sauce", "A mid-priced dish that is easy to eat neatly", "Only an appetizer so you finish first"],
      answer: 2,
      why: "Pick something moderately priced that you can eat in small, tidy bites. You want your hands free to talk, not to wrestle your food."
    },
    {
      topic: "Phones",
      q: "Where should your phone be during the meal?",
      options: ["Face up beside your plate, in case it matters", "On silent and out of sight", "In your lap so you can check it quietly", "On the table, but on vibrate"],
      answer: 1,
      why: "Silence it and put it away before you sit down. Giving the other person your full attention is the point of the meal."
    },
    {
      topic: "Conversation",
      q: "When is the best time to bring up business at a dinner?",
      options: ["Right after you sit down", "Whenever you feel like it", "After small talk, and when your host steers that way", "Never, even if the host asks"],
      answer: 2,
      why: "Start with easy topics such as travel, food, or hobbies. Business can come up after ordering or after the main course, and your host usually sets the pace."
    },
    {
      topic: "Eating",
      q: "You used your fork to cut your food. Where does it go while you pause?",
      options: ["Back on the tablecloth", "Leaning on the edge of your glass", "Resting on the edge of your plate", "In your napkin"],
      answer: 2,
      why: "Once a utensil has been used, it should not touch the table again. Rest it on your plate."
    },
    {
      topic: "Bread",
      q: "How should you eat a dinner roll?",
      options: ["Cut it in half and butter the whole thing", "Tear off one bite-sized piece at a time and butter just that piece", "Bite straight into the whole roll", "Skip it, since bread is never allowed"],
      answer: 1,
      why: "Tear, butter, eat, repeat. It keeps crumbs down and leaves your mouth free to answer questions."
    },
    {
      topic: "The bill",
      q: "You are the guest at a meal your host invited you to. What happens with the bill?",
      options: ["You grab it first to look generous", "You split it down the middle at the table", "Your host pays, and you thank them", "You ask the server to see the total"],
      answer: 2,
      why: "The person who invites typically pays and often settles it quietly in advance. As a guest, a sincere thank-you is the right response."
    },
    {
      topic: "Follow-up",
      q: "What should you do after the meal?",
      options: ["Nothing, the dinner was the whole point", "Send a short thank-you within a day or two and do whatever you promised", "Wait two weeks so it doesn't seem pushy", "Post about it and tag your host"],
      answer: 1,
      why: "A prompt thank-you and keeping any promises you made, such as sending a link or an introduction, shows you are reliable."
    }
  ];

  var form = document.getElementById("quiz");
  if (!form) return;

  var statusEl = document.getElementById("quiz-status");
  var bar = document.getElementById("quiz-bar");
  var resultEl = document.getElementById("quiz-result");
  var resultTitle = document.getElementById("result-title");
  var resultText = document.getElementById("result-text");
  var list = document.getElementById("quiz-questions");
  var answered = 0;
  var correct = 0;

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (text) node.textContent = text;
    return node;
  }

  function render() {
    list.textContent = "";
    answered = 0;
    correct = 0;
    resultEl.hidden = true;
    QUESTIONS.forEach(function (item, qi) {
      var fs = el("fieldset", { "class": "q", "data-index": qi });
      var lg = el("legend");
      lg.appendChild(el("small", null, "Question " + (qi + 1) + " of " + QUESTIONS.length + " · " + item.topic));
      lg.appendChild(document.createTextNode(item.q));
      fs.appendChild(lg);

      var opts = el("div", { "class": "opts" });
      item.options.forEach(function (text, oi) {
        var id = "q" + qi + "o" + oi;
        var wrap = el("div", { "class": "opt" });
        var input = el("input", { type: "radio", name: "q" + qi, id: id, value: oi });
        var label = el("label", { "for": id }, text);
        wrap.appendChild(input);
        wrap.appendChild(label);
        opts.appendChild(wrap);
      });
      fs.appendChild(opts);
      fs.appendChild(el("div", { "class": "feedback", "aria-live": "polite" }));
      list.appendChild(fs);
    });
    updateStatus();
  }

  function updateStatus() {
    statusEl.textContent = answered + " of " + QUESTIONS.length + " answered · " + correct + " correct";
    bar.style.width = (answered / QUESTIONS.length * 100) + "%";
  }

  function finish() {
    var ratio = correct / QUESTIONS.length;
    var title, text;
    if (ratio >= 0.9) {
      title = "You're ready for the table: " + correct + " of " + QUESTIONS.length;
      text = "You know the basics cold. Skim the guide once more before your next meal and you are set.";
    } else if (ratio >= 0.6) {
      title = "Nicely done: " + correct + " of " + QUESTIONS.length;
      text = "You have most of it. Review the questions you missed, then try again.";
    } else {
      title = "Good start: " + correct + " of " + QUESTIONS.length;
      text = "A little more practice and you will feel at ease. Read the guide pages, then take the quiz again.";
    }
    resultTitle.textContent = title;
    resultText.textContent = text;
    resultEl.hidden = false;
  }

  list.addEventListener("change", function (e) {
    var input = e.target;
    if (!input.matches('input[type="radio"]')) return;
    var fs = input.closest(".q");
    if (fs.classList.contains("is-answered")) {
      // Locked: put the original choice back so keyboard arrows can't change it.
      var locked = fs.querySelector('input[data-picked="true"]');
      if (locked) locked.checked = true;
      return;
    }

    var qi = Number(fs.getAttribute("data-index"));
    var item = QUESTIONS[qi];
    var picked = Number(input.value);
    var isRight = picked === item.answer;

    fs.classList.add("is-answered");
    input.setAttribute("data-picked", "true");
    var opts = fs.querySelectorAll(".opt");
    opts[item.answer].classList.add("is-correct");
    if (!isRight) opts[picked].classList.add("is-wrong");

    var fb = fs.querySelector(".feedback");
    var p = el("p");
    p.appendChild(el("span", { "class": "verdict " + (isRight ? "good" : "avoid") }, isRight ? "Correct. " : "Not quite. "));
    p.appendChild(document.createTextNode((isRight ? "" : "The best answer is “" + item.options[item.answer] + "”. ") + item.why));
    fb.appendChild(p);

    answered += 1;
    if (isRight) correct += 1;
    updateStatus();
    if (answered === QUESTIONS.length) finish();
  });

  Array.prototype.forEach.call(document.querySelectorAll("[data-quiz-reset]"), function (btn) {
    btn.addEventListener("click", function () {
      render();
      window.scrollTo({ top: 0 });
      var first = list.querySelector("input");
      if (first) first.focus({ preventScroll: true });
    });
  });

  render();
})();
