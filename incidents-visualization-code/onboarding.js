// Set up the site tour
const tour = new Shepherd.Tour({
  useModalOverlay: true,
  defaultStepOptions: {
    cancelIcon: {
      enabled: true
    },
    scrollTo: { behavior: 'smooth', block: 'center' }
  },
  exitOnEsc: false
});

// Step 1
tour.addStep({
  text: `Read the guideline`,
  attachTo: {
    element: '.prompt-wrapper',
    on: 'left'
  },
  when: {
    show: function() {
      updateOnboardingSteps()
    }
  },
  modalOverlayOpeningPadding: 12,
  modalOverlayOpeningRadius: 12,
  highlightClass: "highlight-guideline",
  buttons: [
    {
      action() {
        return this.next();
      },
      text: '',
      classes: 'onboarding-button onboarding-next'
    }
  ]
});

// Step 2
tour.addStep({
  text: `If the guideline is not relevant, click on "Mark as inapplicable". Otherwise...`,
  attachTo: {
    element: '.skip-card',
    on: 'bottom'
  },
  when: {
    show: function() {
      updateOnboardingSteps()
    }
  },
  modalOverlayOpeningPadding: 12,
  modalOverlayOpeningRadius: 30,
  highlightClass: "highlight-button",
  buttons: [
    {
      action() {
        return this.back();
      },
      classes: 'onboarding-button onboarding-back',
      text: ''
    },
    {
      action() {
        return this.next();
      },
      text: '',
      classes: 'onboarding-button onboarding-next'
    }
  ]
});

// Step 3
tour.addStep({
  text: `…see examples on how the guideline was implemented.`,
  attachTo: {
    element: '.show-examples',
    on: 'top'
  },
  when: {
    show: function() {
      updateOnboardingSteps()
    }
  },
  modalOverlayOpeningPadding: 12,
  modalOverlayOpeningRadius: 24,
  highlightClass: "highlight-button",
  buttons: [
    {
      action() {
        return this.back();
      },
      classes: 'onboarding-button onboarding-back',
      text: ''
    },
    {
      action() {
        return this.next();
      },
      text: '',
      classes: 'onboarding-button onboarding-next'
    }
  ]
});

// Step 4
tour.addStep({
  text: 'Write how you implemented the guideline. Any format - list or paragraph - will do.',
  attachTo: {
    element: '.should-done',
    on: 'right'
  },
  when: {
    show: function() {
      updateOnboardingSteps()
    }
  },
  modalOverlayOpeningPadding: 12,
  modalOverlayOpeningRadius: 12,
  highlightClass: "highlight-input",
  buttons: [
    {
      action() {
        return this.back();
      },
      classes: 'onboarding-button onboarding-back',
      text: ''
    },
    {
      action() {
        return this.next();
      },
      text: '',
      classes: 'onboarding-button onboarding-next'
    }
  ]
});

// Step 5
tour.addStep({
  //title: 'Guideline',
  text: 'If you have not implemented it, say how you would have done so or leave the box blank.',
  attachTo: {
    element: '.write-how',
    on: 'right'
  },
  when: {
    show: function() {
      updateOnboardingSteps()
    }
  },
  modalOverlayOpeningPadding: 12,
  modalOverlayOpeningRadius: 12,
  highlightClass: "highlight-input",
  buttons: [
    {
      action() {
        return this.back();
      },
      classes: 'onboarding-button onboarding-back',
      text: ''
    },
    {
      action() {
        return this.next();
      },
      text: '',
      classes: 'onboarding-button onboarding-next'
    }
  ]
});

// Step 6
tour.addStep({
  text: 'Finally, save your answers.',
  attachTo: {
    element: '.save-card',
    on: 'bottom'
  },
  when: {
    show: function() {
      updateOnboardingSteps()
    }
  },
  modalOverlayOpeningPadding: 12,
  modalOverlayOpeningRadius: 30,
  highlightClass: "highlight-button",
  buttons: [
    {
      action() {
        return this.back();
      },
      classes: 'button-secondary repeat',
      text: 'Repeat onboarding'
    },
    {
      action() {
        return this.next();
      },
      text: "Got it, let's start!",
      classes: 'button-primary start'
    }
  ]
});


// Start the tour after form submission
document.getElementById('submit').addEventListener('click', tour.start());

$(document).on("click", '.shepherd-cancel-icon', function () {
  countCards();
  removeItself();
  updateCounter();
});

$(document).on("click", '.start', function () {
  countCards();
  removeItself();
  updateCounter();
});


$(document).on("click", '.repeat', function () {
  tour.show(0, false);
});


function updateOnboardingSteps() {
  const currentStep = Shepherd.activeTour?.getCurrentStep();
  const currentStepElement = currentStep?.getElement();
  //const footer = currentStepElement?.querySelector('.shepherd-footer');
  const header = currentStepElement?.querySelector('.shepherd-header');
  const progress = document.createElement('span');
  progress.className = 'shepherd-progress';
  progress.innerText = `Step ${Shepherd.activeTour?.steps.indexOf(currentStep) + 1} of ${Shepherd.activeTour?.steps.length}`;
  //footer?.insertBefore(progress, currentStepElement.querySelector('.shepherd-button:last-child'));
  
  const cancel = currentStepElement?.querySelector('.shepherd-cancel-icon');
  cancel.textContent = '✕';
  header?.insertBefore(progress, cancel);

}