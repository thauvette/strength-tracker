import { h } from 'preact'

/**
 * @param {Object} props
 * @param {Number[]} props.activePrimary
 * @param {Number[]} props.activeSecondary
 * @returns <svg />
 */

const generateFill = ({ ids, activePrimary = [], activeSecondary = [] }) => {
  if (activePrimary.some((primaryId) => ids.some((id) => id === +primaryId))) {
    return 'fill-[#1e3a8a] '
  }
  if (
    activeSecondary.some((secondaryId) => ids.some((id) => id === +secondaryId))
  ) {
    return 'fill-[#60a5fa] '
  }
  return 'fill-[#dbeafe]'
}

const Body = ({ activePrimary = [], activeSecondary = [] }) => {
  // get muscle groups from db, so active muscle group props can just be numbers

  return (
    <svg
      viewBox="0 0 567 688"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px);"
    >
      {/* BACK OUTLINE */}
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M412.537 1.41285C399.569 5.30458 390.794 14.6936 388.668 26.9519C387.825 31.8121 388.244 38.3753 389.614 41.7558C390.247 43.3164 390.142 43.4835 388.788 43.0803C386.6 42.4282 385.544 44.6753 385.544 49.9875C385.544 53.8545 385.932 54.9459 388.761 59.0317C391.514 63.0081 392.321 63.6783 394.352 63.6783C396.512 63.6783 396.725 63.9039 396.725 66.19C396.725 67.5715 397.601 70.2482 398.672 72.1386C400.61 75.5588 402.841 88.506 401.893 90.8259C401.663 91.3873 398.339 93.2987 394.507 95.0722C390.676 96.8464 383.228 100.584 377.957 103.379C370.899 107.121 366.708 108.818 362.058 109.82C349.85 112.449 339.363 120.811 333.2 132.831C327.862 143.239 326.237 149.993 326.751 159.622C326.983 163.951 327.399 168.526 327.676 169.788C328.018 171.341 327.389 174.492 325.731 179.532C319.928 197.173 317.453 210.393 317.252 224.834C317.122 234.22 316.818 236.541 315.024 241.843C312.18 250.247 310.638 260.791 309.667 278.468C308.85 293.338 306.8 317.201 306.032 320.778C305.81 321.809 303.021 325.783 299.833 329.61C294.082 336.512 294.016 336.645 291.516 346.142C289.845 352.492 288.035 357.311 286.142 360.454C282.897 365.842 283.246 367.251 287.825 367.251C289.905 367.251 291.392 366.513 294.183 364.1L297.826 360.948L297.35 363.538C296.053 370.597 294.51 390.799 295.217 391.463C297.726 393.817 300.616 388.872 303.673 376.995C304.892 372.254 306.131 368.122 306.424 367.812C306.718 367.503 306.806 373.27 306.621 380.628C306.317 392.735 306.415 394.052 307.651 394.498C308.403 394.768 309.34 394.803 309.734 394.574C310.808 393.951 312.746 387.136 313.997 379.584L315.108 372.873L315.255 378.869C315.488 388.343 316.239 392.304 317.856 392.594C319.459 392.882 320.853 390.135 320.853 386.691C320.853 383.889 321.689 383.904 323.407 386.736C324.311 388.228 325.175 388.823 326.002 388.525C327.044 388.15 327.246 386.322 327.262 377.103C327.273 371.066 327.646 364.643 328.091 362.831C329.365 357.642 329.439 331.542 328.19 327.516C327.2 324.322 327.282 323.783 329.685 317.772C332.687 310.26 332.651 310.364 339.957 287.945C347.859 263.7 348.002 263.029 348.547 247.696C349.001 234.902 349.14 233.989 351.241 230.047C353.542 225.729 357.667 214.932 359.241 209.108L360.149 205.748L361.39 207.971C363.195 211.206 366.328 239.425 366.354 252.701C366.366 258.752 366.761 266.299 367.231 269.472C367.977 274.502 367.862 276.297 366.338 283.482C364.987 289.848 364.71 293.024 365.116 297.444C365.518 301.799 365.247 305.04 363.982 311.034C354.811 354.498 352.755 369.411 352.766 392.376C352.774 406.974 353.1 411.446 355.209 425.901C357.765 443.42 358.285 455.559 356.824 463.57C356.373 466.043 356.001 471.634 355.999 475.993C355.995 482.151 355.571 485.244 354.101 489.86C353.061 493.127 351.805 498.162 351.312 501.048C348.819 515.649 348.029 551.176 349.669 574.88C350.141 581.682 350.585 594.5 350.657 603.363C350.804 621.557 350.411 623.326 343.968 633.506C337.817 643.224 319.322 664.444 313.665 668.274C311.689 669.612 309.442 671.713 308.674 672.942C306.759 676.005 306.865 679.904 308.907 681.546C311.032 683.254 317.473 685.293 319.002 684.742C319.659 684.506 321.111 684.988 322.23 685.813C325.875 688.504 329.56 687.771 335.628 683.148C337.385 681.809 340.295 680.345 342.094 679.894C346.974 678.67 351.255 675.377 355.968 669.22C361.699 661.735 364.381 659.182 369.722 656.129C375.463 652.846 381.339 646.785 382.004 643.461C382.289 642.032 381.911 638.354 381.129 634.958C380.113 630.547 379.962 628.407 380.55 626.821C381.12 625.286 381.033 623.278 380.244 619.825C378.997 614.362 379.255 609.5 381.673 592.895C384.78 571.562 387.875 560.298 393.932 548.297C395.811 544.572 397.837 539.669 398.434 537.402C400.036 531.322 399.637 510.794 397.703 499.708C396.224 491.234 396.218 490.771 397.569 488.404C400.31 483.606 401.61 477.684 402.333 466.692L403.067 455.573L407.06 447.409C413.717 433.796 416.484 424.992 424.599 391.612C426.303 384.603 427.906 379.375 428.163 379.994C428.419 380.612 430.805 389.382 433.465 399.482C440.568 426.454 442.753 432.738 450.654 448.914C454.077 455.921 454.238 456.579 455.004 466.636C455.814 477.277 457.131 482.974 460.009 488.276C461.755 491.492 461.725 494.872 459.817 510.417C458.815 518.58 459.403 531.205 461.091 537.776C461.727 540.25 464.2 545.984 466.587 550.519C471.673 560.181 473.371 565.611 476.548 582.375C480.866 605.155 481.708 612.762 480.551 618.518C479.721 622.649 479.721 624.146 480.553 626.51C481.38 628.865 481.384 630.632 480.573 635.75C479.768 640.829 479.768 642.643 480.573 644.931C481.863 648.604 485.967 652.84 491.208 655.911C497.036 659.326 499.287 661.399 504.144 667.826C506.481 670.918 509.414 674.34 510.661 675.432C513.368 677.8 518.754 680.568 520.656 680.568C521.405 680.568 523.713 681.946 525.787 683.63C531.914 688.607 534.948 689.185 538.836 686.114C540.298 684.96 541.821 684.35 542.57 684.62C544.11 685.174 550.747 683.148 552.635 681.546C554.279 680.15 554.324 675.861 552.726 672.881C552.117 671.745 550.243 670.001 548.562 669.005C545.646 667.277 541.097 662.624 536.119 656.278C520.633 636.535 513.914 627.33 512.386 623.76L510.552 619.479L510.45 576.379C510.353 535.583 509.531 514.192 507.681 504.269C507.241 501.918 505.825 496.459 504.532 492.139C502.82 486.414 502.069 481.981 501.767 475.8C501.538 471.134 500.771 463.607 500.062 459.072C498.585 449.632 498.853 443.312 501.538 424.218C502.917 414.419 503.266 408.269 503.221 394.61C503.145 371.458 501.048 356.748 492.803 321.528C488.932 304.989 488.348 301.454 488.466 295.293C488.558 290.507 488.114 286.286 487.113 282.42C485.743 277.126 485.677 274.825 486.285 253.562C486.999 228.555 488.482 211.3 490.171 208.338C491.184 206.561 491.378 206.889 494.157 215.09C495.763 219.831 498.179 225.735 499.526 228.211C501.89 232.559 501.992 233.158 502.525 245.826C502.874 254.123 503.616 261.141 504.547 264.936C506.704 273.738 515.988 302.45 520.232 313.448C523.614 322.21 523.845 323.243 523.075 326.191C521.432 332.476 521.231 337.809 522.179 350.011C522.707 356.813 523.358 367.941 523.625 374.738C524.055 385.67 524.271 387.126 525.499 387.347C526.371 387.503 527.237 386.878 527.824 385.669C529.16 382.917 529.733 383.258 530.565 387.302C531.142 390.101 531.632 390.862 532.86 390.862C534.964 390.862 535.491 388.732 535.731 379.244C535.84 374.915 536.078 372.386 536.26 373.622C536.684 376.521 539.623 390.461 540.171 392.174C540.421 392.956 541.376 393.486 542.533 393.486C544.773 393.486 544.714 393.967 544.588 376.621L544.512 366.127L547.227 375.607C550.033 385.404 551.484 388.792 553.573 390.419C555.714 392.086 556.407 390.655 556.006 385.402C555.201 374.891 553.924 362.321 553.513 360.88C553.213 359.827 554.153 360.349 556.676 362.638C559.493 365.193 560.889 365.912 563.154 365.972C567.932 366.1 568.112 365.106 564.505 358.541C562.348 354.616 560.693 350.12 559.572 345.139C557.6 336.384 557.149 335.467 551.647 329.058C544.239 320.428 544.888 322.672 542.964 299.041C542.511 293.475 541.744 282.682 541.26 275.055C540.174 257.946 538.798 248.836 536.053 240.575C534.19 234.969 533.912 232.763 533.735 222.211C533.512 208.862 531.755 199.156 526.471 182.073L523.583 172.74L524.116 161.496C524.545 152.438 524.397 149.239 523.355 145.04C521.829 138.891 516.019 127.028 512.479 122.833C507.48 116.909 496.168 110.045 489.725 109.026C483.66 108.067 478.514 106.159 469.403 101.494C464.351 98.9077 457.523 95.6793 454.228 94.3204C450.934 92.9614 447.946 91.4983 447.588 91.0688C446.505 89.7668 447.69 75.1188 449.083 72.589C449.774 71.3358 450.593 68.9154 450.903 67.2117C451.345 64.7809 451.876 64.0223 453.371 63.691C454.418 63.4594 455.668 62.6026 456.148 61.7871C456.628 60.9723 457.919 59.1247 459.018 57.6818C460.712 55.4585 461.017 54.2255 461.017 49.597C461.017 43.9603 460.134 42.336 457.572 43.2594C456.576 43.6177 456.471 43.1417 456.937 40.3789C457.244 38.5582 457.705 34.8253 457.96 32.0834C459.009 20.8258 451.98 9.16783 440.865 3.7305C432.908 -0.162726 421.025 -1.13491 412.537 1.41285Z"
        fill="#d6d3d1"
      />
      <path
        d="M446 67C445.5 61.5 429 61 429 61C429 61 429 92.5 431 96C433 99.5 472.5 121.5 477.5 120C482.5 118.5 493 116 490.5 113.5C488 111 473.5 107.5 471.5 106C470.067 104.925 456.566 97.9448 449.029 94.0747C446.015 92.5272 444.296 89.259 444.685 85.8934C445.384 79.8358 446.325 70.5715 446 67Z"
        className={`trap ${generateFill({
          ids: [16, 8],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M402.879 67C403.379 61.5 419.879 61 419.879 61C419.879 61 419.879 92.5 417.879 96C415.879 99.5 376.379 121.5 371.379 120C366.379 118.5 355.879 116 358.379 113.5C360.879 111 375.379 107.5 377.379 106C378.812 104.925 392.313 97.9448 399.85 94.0747C402.864 92.5272 404.583 89.259 404.194 85.8934C403.495 79.8358 402.554 70.5715 402.879 67Z"
        className={`trap ${generateFill({
          ids: [16, 8],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M469.477 121.5C469.477 121.5 457.477 125.5 452.977 127C448.477 128.5 428.977 133 428.977 133C428.977 133 431.977 120 431.977 111.5C431.977 103 428.977 99 428.977 99L448.477 111.5L469.477 121.5Z"
        className={`trap ${generateFill({
          ids: [16, 30],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M379.663 121.5C379.663 121.5 391.663 125.5 396.162 127C400.662 128.5 420.163 133 420.163 133C420.163 133 417.162 120 417.162 111.5C417.162 103 420.162 99.0001 420.162 99.0001L400.663 111.5L379.663 121.5Z"
        className={`trap ${generateFill({
          ids: [16, 30],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M428.839 135.216L464.839 125.716C464.839 125.716 456.839 152.716 454.339 168.716C451.839 184.716 428.839 226.216 428.839 226.216L428.839 135.216Z"
        className={`trap ${generateFill({
          ids: [16, 31],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M419.693 135.216L383.693 125.716C383.693 125.716 391.693 152.716 394.193 168.716C396.693 184.716 419.693 226.216 419.693 226.216L419.693 135.216Z"
        className={`trap ${generateFill({
          ids: [16, 31],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M364.5 120.186C361 118.686 352 116.686 349 119.186C346 121.686 342 125.686 342 125.686C342 125.686 330 141.186 330 151.186C330 161.186 332.5 172.686 332.5 172.686C332.5 172.686 348 166.186 355.5 160.686C363 155.186 373.5 143.686 373.5 143.686C373.5 143.686 385.5 131.686 383.5 128.686C381.5 125.686 368 121.686 364.5 120.186Z"
        className={`delt ${generateFill({
          ids: [15],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M487.5 119.5C491 118 500 116 503 118.5C506 121 510 125 510 125C510 125 522 140.5 522 150.5C522 160.5 519.5 172 519.5 172C519.5 172 504 165.5 496.5 160C489 154.5 478.5 143 478.5 143C478.5 143 466.5 131 468.5 128C470.5 125 484 121 487.5 119.5Z"
        className={`delt ${generateFill({
          ids: [15],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M442.984 253.213C439.597 242.089 434.9 235.659 429 234C429.191 269.589 429.314 300.463 429.206 306.266C431.439 306.266 437.722 302.636 439.677 300.542C441.631 298.447 441.771 294.678 453.36 289.233C456.345 287.83 459.093 285.005 461.57 281.368C451.725 273.391 444.571 258.429 442.984 253.213Z"
        className={`lower-back ${generateFill({
          ids: [9],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M406.586 253.213C409.973 242.089 414.67 235.659 420.57 234C420.379 269.589 420.256 300.463 420.364 306.266C418.131 306.266 411.848 302.636 409.893 300.542C407.939 298.447 407.799 294.678 396.21 289.233C393.225 287.83 390.477 285.005 388 281.368C397.845 273.391 404.999 258.429 406.586 253.213Z"
        className={`lower-back ${generateFill({
          ids: [9],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M468.192 137.445L492 162.5L490 195C490 195 483 235 480.5 251.5C478 268 466.192 279.945 466.192 279.945C466.192 279.945 457.5 271.5 454 260C450.5 248.5 434 229.5 434 229.5C434 229.5 452.591 190.974 460 172.5C467.409 154.026 466.016 136.627 468.192 137.445Z"
        className={`lat ${generateFill({
          ids: [7],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M383.808 138.028L360 163.083L362 195.583C362 195.583 369 235.583 371.5 252.083C374 268.583 385.808 280.528 385.808 280.528C385.808 280.528 394.5 272.083 398 260.583C401.5 249.083 418 230.083 418 230.083C418 230.083 399.409 191.557 392 173.083C384.591 154.609 385.984 137.21 383.808 138.028Z"
        className={`lat ${generateFill({
          ids: [7],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M531 240.5C532.235 231.22 530.684 205.679 527.96 196.145C527.119 193.201 525.677 190.04 523.876 186.84C521.355 182.709 523.802 185.211 514.901 176.106C506 167 503.648 170.531 496.88 165C496.658 168.907 495.368 177.177 493.201 187.699C490.984 198.456 495.725 207.94 498.5 216.5C500.09 221.406 504.37 234.456 510 240.5C511.379 233.218 517.5 233 517.5 228.5C522 233 526.342 236.381 531 240.5Z"
        className={`tricep ${generateFill({
          ids: [18],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M319.105 240.501C317.87 231.221 319.42 205.68 322.144 196.145C322.985 193.202 324.427 190.04 326.229 186.841C328.75 182.709 326.302 185.212 335.203 176.106C344.105 167.001 346.457 170.531 353.225 165.001C353.447 168.907 354.736 177.177 356.904 187.7C359.12 198.457 354.379 207.941 351.605 216.501C350.014 221.406 345.735 234.456 340.105 240.501C338.725 233.219 332.605 233.001 332.605 228.501C328.105 233.001 323.762 236.381 319.105 240.501Z"
        className={`tricep ${generateFill({
          ids: [18],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M482.905 377.718C482.905 377.718 500.163 396.769 503 405.5C502.945 382.511 503.306 377.251 501.5 362C499.694 346.748 493.608 322.459 489.299 309.86C486.814 302.599 488.5 281.5 482.905 276.5L475.884 270C473.094 276.723 468.611 284.841 462 289.413C468.584 287.226 475.8 294.435 480 304C484.2 313.566 489.84 320.028 491.614 344.784C493.389 369.541 488.779 373.959 482.905 377.718Z"
        className={`abductor ${generateFill({
          ids: [23],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M369.595 377.718C369.595 377.718 355.337 396.269 352.5 405C352.555 382.011 351.694 376.751 353.5 361.5C355.306 346.248 358.892 322.459 363.201 309.86C365.686 302.599 364 281.5 369.595 276.5L376.616 270C379.406 276.723 383.889 284.841 390.5 289.413C383.916 287.226 376.7 294.435 372.5 304C368.3 313.566 362.66 320.028 360.886 344.784C359.111 369.541 363.721 373.959 369.595 377.718Z"
        className={`abductor ${generateFill({
          ids: [23],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M463.805 299C472.478 299 481.952 321.331 483.818 338.255C484.583 345.198 487.592 375.642 475.558 376.096C463.524 376.548 440.077 373.892 435.307 368.34C430.536 362.788 428.802 357.236 429.018 349.079C429.235 340.922 431.403 332.083 437.907 324.152C444.413 316.221 455.228 299 463.434 299"
        className={`glute ${generateFill({
          ids: [12],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M386.909 299C378.236 299 368.762 321.331 366.896 338.255C366.131 345.198 363.122 375.642 375.156 376.096C387.19 376.548 410.637 373.892 415.408 368.34C420.178 362.788 421.912 357.236 421.696 349.079C421.479 340.922 419.312 332.083 412.807 324.152C406.301 316.221 395.486 299 387.281 299"
        className={`glute ${generateFill({
          ids: [12],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M479 379C484 380.5 492.5 391.5 492.5 391.5C492.5 391.5 501 405 499.5 410C498 415 493.5 443 494.5 451.5C495.5 460 502.5 495.5 499.5 502C496.5 508.5 489.75 507 484 507C478.25 507 471 507 468 502C465 497 459.5 462.5 459.5 454C459.5 445.5 448 410 448 410C448 410 442 382 449.5 379C457 376 474 377.5 479 379Z"
        className={`hammy ${generateFill({
          ids: [13],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M376.242 378.732C371.242 380.232 362.742 391.232 362.742 391.232C362.742 391.232 354.242 404.732 355.742 409.732C357.242 414.732 361.742 442.732 360.742 451.232C359.742 459.732 352.742 495.232 355.742 501.732C358.742 508.232 365.492 506.732 371.242 506.732C376.992 506.732 384.242 506.732 387.242 501.732C390.242 496.732 395.742 462.232 395.742 453.732C395.742 445.232 407.242 409.732 407.242 409.732C407.242 409.732 413.242 381.732 405.742 378.732C398.242 375.732 381.242 377.232 376.242 378.732Z"
        className={`hammy ${generateFill({
          ids: [13],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M403.207 446.338L417.5 407.5C417.5 407.5 428.5 380 425.5 376.5C422.5 373 414.5 376 412.5 378C410.5 380 413.5 383.5 410.5 401.5C407.5 419.5 403.207 446.338 403.207 446.338Z"
        className={`adductor ${generateFill({
          ids: [13],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M452.388 445.923L438.095 407.085C438.095 407.085 427.095 379.585 430.095 376.085C433.095 372.585 441.095 375.585 443.095 377.585C445.095 379.585 442.095 383.085 445.095 401.085C448.095 419.085 452.388 445.923 452.388 445.923Z"
        className={`adductor ${generateFill({
          ids: [13],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M478.688 508.666C465.09 509.7 466.364 527.304 467.165 533.964C467.966 540.622 470.305 545.962 472.875 550.765C475.444 555.569 480.766 573.232 482.409 580.888C482.698 582.231 482.875 583.114 482.979 583.691C484.522 587.252 489.138 601.456 492.5 601C496.865 600.409 502 597 502 580.888C502.017 576.542 500.739 534.641 499.5 524C498.261 513.361 483.379 508.309 478.688 508.666Z"
        className={`calve ${generateFill({
          ids: [11],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M379.93 508.518C393.527 509.552 392.253 527.156 391.452 533.816C390.652 540.474 388.312 545.814 385.743 550.617C383.173 555.421 377.852 573.085 376.209 580.74C375.92 582.084 375.743 582.966 375.639 583.544C374.095 587.105 369.48 601.308 366.117 600.853C361.753 600.261 356.617 596.853 356.617 580.74C356.601 576.394 357.878 534.493 359.117 523.853C360.357 513.213 375.239 508.162 379.93 508.518Z"
        className={`calve ${generateFill({
          ids: [11],
          activePrimary,
          activeSecondary,
        })}`}
      />
      {/* FRONT OUTLINE */}
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M128.537 1.41285C115.569 5.30458 106.794 14.6936 104.668 26.9519C103.825 31.8121 104.244 38.3753 105.614 41.7558C106.247 43.3164 106.142 43.4835 104.788 43.0803C102.6 42.4282 101.544 44.6753 101.544 49.9875C101.544 53.8545 101.932 54.9459 104.761 59.0317C107.514 63.0081 108.321 63.6783 110.352 63.6783C112.512 63.6783 112.725 63.9039 112.725 66.19C112.725 67.5715 113.601 70.2482 114.672 72.1386C116.61 75.5588 118.841 88.506 117.893 90.8259C117.663 91.3873 114.339 93.2987 110.507 95.0722C106.676 96.8464 99.2281 100.584 93.957 103.379C86.8993 107.121 82.7079 108.818 78.0582 109.82C65.8499 112.449 55.3628 120.811 49.1996 132.831C43.8622 143.239 42.2369 149.993 42.7513 159.622C42.9829 163.951 43.399 168.526 43.6761 169.788C44.0179 171.341 43.3886 174.492 41.7306 179.532C35.9276 197.173 33.4533 210.393 33.2521 224.834C33.1219 234.22 32.8176 236.541 31.0238 241.843C28.1798 250.247 26.6384 260.791 25.6673 278.468C24.8502 293.338 22.8001 317.201 22.0318 320.778C21.8098 321.809 19.0209 325.783 15.8326 329.61C10.0823 336.512 10.016 336.645 7.51626 346.142C5.84467 352.492 4.03492 357.311 2.14212 360.454C-1.10282 365.842 -0.753803 367.251 3.82488 367.251C5.90457 367.251 7.39247 366.513 10.183 364.1L13.8256 360.948L13.3504 363.538C12.0534 370.597 10.5104 390.799 11.2172 391.463C13.7258 393.817 16.6161 388.872 19.6726 376.995C20.8921 372.254 22.1308 368.122 22.4239 367.812C22.7178 367.503 22.8065 373.27 22.6212 380.628C22.3169 392.735 22.4151 394.052 23.6515 394.498C24.403 394.768 25.3398 394.803 25.7335 394.574C26.8077 393.951 28.7461 387.136 29.9968 379.584L31.1077 372.873L31.2554 378.869C31.4878 388.343 32.2386 392.304 33.8559 392.594C35.4588 392.882 36.8532 390.135 36.8532 386.691C36.8532 383.889 37.6894 383.904 39.4065 386.736C40.3114 388.228 41.1747 388.823 42.0021 388.525C43.0444 388.15 43.2456 386.322 43.2616 377.103C43.2728 371.066 43.6458 364.643 44.0914 362.831C45.3653 357.642 45.4387 331.542 44.1904 327.516C43.2001 324.322 43.2824 323.783 45.6847 317.772C48.6869 310.26 48.6509 310.364 55.957 287.945C63.8589 263.7 64.0018 263.029 64.5465 247.696C65.001 234.902 65.1399 233.989 67.2412 230.047C69.5421 225.729 73.6672 214.932 75.2405 209.108L76.1486 205.748L77.3897 207.971C79.1954 211.206 82.3278 239.425 82.3541 252.701C82.3661 258.752 82.7614 266.299 83.231 269.472C83.977 274.502 83.862 276.297 82.3381 283.482C80.9868 289.848 80.7097 293.024 81.1162 297.444C81.5179 301.799 81.2472 305.04 79.9821 311.034C70.8112 354.498 68.7546 369.411 68.7658 392.376C68.7738 406.974 69.0996 411.446 71.2089 425.901C73.7654 443.42 74.2853 455.559 72.8238 463.57C72.3725 466.043 72.0012 471.634 71.9988 475.993C71.9948 482.151 71.5715 485.244 70.1012 489.86C69.0605 493.127 67.805 498.162 67.3123 501.048C64.8189 515.649 64.029 551.176 65.6694 574.88C66.1406 581.682 66.5847 594.5 66.6566 603.363C66.8043 621.557 66.4114 623.326 59.9678 633.506C53.8166 643.224 35.3222 664.444 29.6653 668.274C27.6887 669.612 25.442 671.713 24.6737 672.942C22.7586 676.005 22.8648 679.904 24.9069 681.546C27.0322 683.254 33.4725 685.293 35.0019 684.742C35.6592 684.506 37.1112 684.988 38.2301 685.813C41.8751 688.504 45.5601 687.771 51.6283 683.148C53.3853 681.809 56.2948 680.345 58.0942 679.894C62.974 678.67 67.2548 675.377 71.9684 669.22C77.6988 661.735 80.3814 659.182 85.722 656.129C91.4628 652.846 97.3393 646.785 98.0037 643.461C98.2889 642.032 97.9111 638.354 97.1292 634.958C96.1133 630.547 95.9616 628.407 96.5502 626.821C97.1204 625.286 97.0326 623.278 96.2443 619.825C94.9968 614.362 95.2548 609.5 97.6731 592.895C100.78 571.562 103.875 560.298 109.932 548.297C111.811 544.572 113.837 539.669 114.434 537.402C116.036 531.322 115.637 510.794 113.703 499.708C112.224 491.234 112.218 490.771 113.569 488.404C116.31 483.606 117.61 477.684 118.333 466.692L119.067 455.573L123.06 447.409C129.717 433.796 132.484 424.992 140.599 391.612C142.303 384.603 143.906 379.375 144.163 379.994C144.419 380.612 146.805 389.382 149.465 399.482C156.568 426.454 158.753 432.738 166.654 448.914C170.077 455.921 170.238 456.579 171.004 466.636C171.814 477.277 173.131 482.974 176.009 488.276C177.755 491.492 177.725 494.872 175.817 510.417C174.815 518.58 175.403 531.205 177.091 537.776C177.727 540.25 180.2 545.984 182.587 550.519C187.673 560.181 189.371 565.611 192.548 582.375C196.866 605.155 197.708 612.762 196.551 618.518C195.721 622.649 195.721 624.146 196.553 626.51C197.38 628.865 197.384 630.632 196.573 635.75C195.768 640.829 195.768 642.643 196.573 644.931C197.863 648.604 201.967 652.84 207.208 655.911C213.036 659.326 215.287 661.399 220.144 667.826C222.481 670.918 225.414 674.34 226.661 675.432C229.368 677.8 234.754 680.568 236.656 680.568C237.405 680.568 239.713 681.946 241.787 683.63C247.914 688.607 250.948 689.185 254.836 686.114C256.298 684.96 257.821 684.35 258.57 684.62C260.11 685.174 266.747 683.148 268.635 681.546C270.279 680.15 270.324 675.861 268.726 672.881C268.117 671.745 266.243 670.001 264.562 669.005C261.646 667.277 257.097 662.624 252.119 656.278C236.633 636.535 229.914 627.33 228.386 623.76L226.552 619.479L226.45 576.379C226.353 535.583 225.531 514.192 223.681 504.269C223.241 501.918 221.825 496.459 220.532 492.139C218.82 486.414 218.069 481.981 217.767 475.8C217.538 471.134 216.771 463.607 216.062 459.072C214.585 449.632 214.853 443.312 217.538 424.218C218.917 414.419 219.266 408.269 219.221 394.61C219.145 371.458 217.048 356.748 208.803 321.528C204.932 304.989 204.348 301.454 204.466 295.293C204.558 290.507 204.114 286.286 203.113 282.42C201.743 277.126 201.677 274.825 202.285 253.562C202.999 228.555 204.482 211.3 206.171 208.338C207.184 206.561 207.378 206.889 210.157 215.09C211.763 219.831 214.179 225.735 215.526 228.211C217.89 232.559 217.992 233.158 218.525 245.826C218.874 254.123 219.616 261.141 220.547 264.936C222.704 273.738 231.988 302.45 236.232 313.448C239.614 322.21 239.845 323.243 239.075 326.191C237.432 332.476 237.231 337.809 238.179 350.011C238.707 356.813 239.358 367.941 239.625 374.738C240.055 385.67 240.271 387.126 241.499 387.347C242.371 387.503 243.237 386.878 243.824 385.669C245.16 382.917 245.733 383.258 246.565 387.302C247.142 390.101 247.632 390.862 248.86 390.862C250.964 390.862 251.491 388.732 251.731 379.244C251.84 374.915 252.078 372.386 252.26 373.622C252.684 376.521 255.623 390.461 256.171 392.174C256.421 392.956 257.376 393.486 258.533 393.486C260.773 393.486 260.714 393.967 260.588 376.621L260.512 366.127L263.227 375.607C266.033 385.404 267.484 388.792 269.573 390.419C271.714 392.086 272.407 390.655 272.006 385.402C271.201 374.891 269.924 362.321 269.513 360.88C269.213 359.827 270.153 360.349 272.676 362.638C275.493 365.193 276.889 365.912 279.154 365.972C283.932 366.1 284.112 365.106 280.505 358.541C278.348 354.616 276.693 350.12 275.572 345.139C273.6 336.384 273.149 335.467 267.647 329.058C260.239 320.428 260.888 322.672 258.964 299.041C258.511 293.475 257.744 282.682 257.26 275.055C256.174 257.946 254.798 248.836 252.053 240.575C250.19 234.969 249.912 232.763 249.735 222.211C249.512 208.862 247.755 199.156 242.471 182.073L239.583 172.74L240.116 161.496C240.545 152.438 240.397 149.239 239.355 145.04C237.829 138.891 232.019 127.028 228.479 122.833C223.48 116.909 212.168 110.045 205.725 109.026C199.66 108.067 194.514 106.159 185.403 101.494C180.351 98.9077 173.523 95.6793 170.228 94.3204C166.934 92.9614 163.946 91.4983 163.588 91.0688C162.505 89.7668 163.69 75.1188 165.083 72.589C165.774 71.3358 166.593 68.9154 166.903 67.2117C167.345 64.7809 167.876 64.0223 169.371 63.691C170.418 63.4594 171.668 62.6026 172.148 61.7871C172.628 60.9723 173.919 59.1247 175.018 57.6818C176.712 55.4585 177.017 54.2255 177.017 49.597C177.017 43.9603 176.134 42.336 173.572 43.2594C172.576 43.6177 172.471 43.1417 172.937 40.3789C173.244 38.5582 173.705 34.8253 173.96 32.0834C175.009 20.8258 167.98 9.16783 156.865 3.7305C148.908 -0.162726 137.025 -1.13491 128.537 1.41285Z"
        fill="#d6d3d1"
      />
      <path
        d="M79.5 117.186C76 115.686 67 113.686 64 116.186C61 118.686 57 122.686 57 122.686C57 122.686 45 138.186 45 148.186C45 158.186 47.5 169.686 47.5 169.686C47.5 169.686 63 163.186 70.5 157.686C78 152.186 88.5 140.686 88.5 140.686C88.5 140.686 100.5 128.686 98.5 125.686C96.5 122.686 83 118.686 79.5 117.186Z"
        className={`delt ${generateFill({
          ids: [15],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M203.5 117.186C207 115.686 216 113.686 219 116.186C222 118.686 226 122.686 226 122.686C226 122.686 238 138.186 238 148.186C238 158.186 235.5 169.686 235.5 169.686C235.5 169.686 220 163.186 212.5 157.686C205 152.186 194.5 140.686 194.5 140.686C194.5 140.686 182.5 128.686 184.5 125.686C186.5 122.686 200 118.686 203.5 117.186Z"
        className={`delt ${generateFill({
          ids: [15],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M156.19 86C153.69 103 176.69 125.471 179.19 124C187.69 119 207.19 113 207.19 113C207.19 113 185.69 105.5 180.69 102C175.69 98.5 160.19 94 156.19 86Z"
        className={`trap ${generateFill({
          ids: [16, 8],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M127 86.5C129.5 103.5 106.5 125.971 104 124.5C95.5 119.5 76 113.5 76 113.5C76 113.5 97.5 106 102.5 102.5C107.5 99 123 94.5 127 86.5Z"
        className={`trap ${generateFill({
          ids: [16, 8],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M180 130C169.455 123.532 168.921 120.844 164 120C164 120 156.094 123.656 153 124.5C149.907 125.343 145.421 126.236 145 136.5C144.578 146.765 144.859 167.391 145 170.625C145.14 173.859 143.769 178.921 147.988 181.733C152.206 184.545 163.735 186.562 174 186C184.264 185.438 190.732 185.951 198.325 170.625C205.917 155.299 200.5 151 200.5 151C200.5 151 190.545 136.468 180 130Z"
        className={`pec ${generateFill({
          ids: [10],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M103.373 130C113.918 123.532 114.452 120.844 119.373 120C119.373 120 127.279 123.656 130.373 124.5C133.466 125.343 137.952 126.236 138.373 136.5C138.795 146.765 138.514 167.391 138.373 170.625C138.233 173.859 139.604 178.921 135.385 181.733C131.167 184.545 119.638 186.562 109.373 186C99.1086 185.438 92.6408 185.951 85.0478 170.625C77.4558 155.299 82.8727 151 82.8727 151C82.8727 151 92.8276 136.468 103.373 130Z"
        className={`pec ${generateFill({
          ids: [10],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M241 237C247.898 232.698 246.554 207.773 239.441 192.83C232.326 177.886 210.553 160.225 208.397 160C208.397 160 205.253 172.452 208.397 199.848C217.236 221.132 234.102 241.302 241 237Z"
        className={`bicep ${generateFill({
          ids: [17],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M41.5308 237C34.6323 232.698 35.9769 207.773 43.0901 192.83C50.2043 177.886 71.9776 160.225 74.1333 160C74.1333 160 77.2776 172.452 74.1333 199.848C65.2949 221.132 48.4292 241.302 41.5308 237Z"
        className={`bicep ${generateFill({
          ids: [17],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M30.3677 266.183C33.3322 246.144 38.8829 242.73 45.7141 243.741C52.5454 244.751 61.4645 244.961 58.5 265C55.5355 285.039 44.2003 305.307 37.369 304.297C30.5378 303.286 27.4031 286.222 30.3677 266.183Z"
        className={`bicep ${generateFill({
          ids: [19],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M253.938 266.194C250.973 246.155 245.423 242.741 238.591 243.752C231.76 244.762 222.841 244.972 225.805 265.011C228.77 285.05 240.105 305.318 246.936 304.307C253.768 303.297 256.902 286.233 253.938 266.194Z"
        className={`bicep ${generateFill({
          ids: [19],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M103.149 202.339C102.87 198.198 105.466 194.41 109.538 193.61C112.606 193.008 116.45 192.432 120.536 192.255C124.584 192.078 128.512 192.155 131.701 192.302C135.969 192.498 139.266 195.938 139.552 200.201V200.201C139.959 206.252 134.241 210.904 128.188 210.517C126.342 210.399 124.493 210.395 122.809 210.586C120.476 210.851 117.698 211.401 115.003 212.027C109.339 213.342 103.625 209.428 103.235 203.625L103.149 202.339Z"
        className={`ab ${generateFill({
          ids: [20, 27],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M182.234 202.339C182.513 198.198 179.917 194.41 175.845 193.61C172.777 193.008 168.933 192.433 164.847 192.255C160.799 192.078 156.871 192.155 153.682 192.302C149.414 192.499 146.117 195.938 145.831 200.201V200.201C145.424 206.253 151.142 210.904 157.195 210.517C159.041 210.399 160.89 210.395 162.574 210.586C164.908 210.851 167.685 211.402 170.38 212.027C176.044 213.342 181.758 209.428 182.148 203.626L182.234 202.339Z"
        className={`ab ${generateFill({
          ids: [20, 27],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M108.662 217.526C120.338 209.867 130.526 211.193 137.929 215.511C141.265 221.99 141.886 235.938 139.941 241.686C127.314 240.383 118.578 239.684 110.708 244.789C109.134 245.809 104.309 225.331 108.662 217.526Z"
        className={`ab ${generateFill({
          ids: [20, 28],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M179.185 218.526C167.509 210.867 157.321 212.193 149.918 216.511C146.582 222.99 145.961 236.938 147.907 242.686C160.533 241.383 169.269 240.684 177.139 245.789C178.713 246.809 183.538 226.331 179.185 218.526Z"
        className={`ab ${generateFill({
          ids: [20, 28],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M110.615 248.716C122.896 241.461 133.044 243.626 140.18 248.758C143.074 255.879 142.708 270.722 140.345 276.675C127.744 274.352 119.011 272.959 110.737 277.788C109.083 278.753 105.684 256.671 110.615 248.716Z"
        className={`ab ${generateFill({
          ids: [20, 28],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M175.678 248.716C163.397 241.461 153.249 243.626 146.113 248.758C143.219 255.879 143.585 270.722 145.948 276.675C158.549 274.352 167.282 272.959 175.556 277.788C177.21 278.753 180.609 256.671 175.678 248.716Z"
        className={`ab ${generateFill({
          ids: [20, 28],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M140.102 343.027C119.579 348.288 108.18 289.248 110.516 283.369C113.267 279.948 126.773 274.638 139.762 282.59C141.379 288.497 140.088 340.57 140.102 343.027Z"
        className={`ab ${generateFill({
          ids: [20, 29],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M145.819 343.027C166.342 348.288 177.741 289.248 175.405 283.369C172.654 279.948 159.148 274.638 146.159 282.59C144.542 288.497 145.833 340.57 145.819 343.027Z"
        className={`ab ${generateFill({
          ids: [20, 29],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M99.5 197.5C99.5 197.5 95.5 214.5 99.5 256.455C103.5 298.409 114 320 114 320C114 320 107.5 321 95.5 317.5C83.5 314 84.4202 310.987 84.4202 310.987C84.4202 310.987 86.0867 312.19 86.0867 256.455C86.0867 200.72 79.0042 199.517 79.0042 199.517C79.0042 199.517 78.5875 195.908 86.0867 195.106C93.5859 194.304 99.5 197.5 99.5 197.5Z"
        className={`oblique ${generateFill({
          ids: [21],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M186.5 197.523C186.5 197.523 190.5 214.523 186.5 256.478C182.5 298.433 172 320.023 172 320.023C172 320.023 178.5 321.023 190.5 317.523C202.5 314.023 201.58 311.01 201.58 311.01C201.58 311.01 199.913 312.213 199.913 256.478C199.913 200.743 206.996 199.54 206.996 199.54C206.996 199.54 207.413 195.931 199.913 195.129C192.414 194.327 186.5 197.523 186.5 197.523Z"
        className={`oblique ${generateFill({
          ids: [21],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M80.4225 314.568C89.7312 323.697 107.309 324.231 108.996 324.866C117.715 340.292 130.388 344.02 130.388 344.02C130.388 344.02 89 347 77.5002 328.5C79.5 322.5 80.7963 313.967 80.4225 314.568Z"
        className={`oblique ${generateFill({
          ids: [21],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M206.89 314.531C197.582 323.66 180.004 324.194 178.317 324.829C169.598 340.255 156.925 343.983 156.925 343.983C156.925 343.983 198.313 346.963 209.813 328.463C207.813 322.463 206.516 313.93 206.89 314.531Z"
        className={`oblique ${generateFill({
          ids: [21],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M87.4999 366C87.4999 366 120 377.5 125 400C120.5 442.5 121 441.5 114 474.5C98.5002 497.5 75.9999 482 75.9999 472.5C72 412 87.4999 366 87.4999 366Z"
        className={`quad ${generateFill({
          ids: [14],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M201.5 366C201.5 366 169 377.5 164 400C168.5 442.5 168 441.5 175 474.5C190.5 497.5 213 482 213 472.5C217 412 201.5 366 201.5 366Z"
        className={`quad ${generateFill({
          ids: [14],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M74.4026 418.153C66.4615 375.136 74.2608 352.684 75.5503 346.469C78.8203 330.711 90.3127 343.446 90.3127 343.446C90.3127 343.446 81.3806 361.01 74.4026 418.153Z"
        className={`abductor ${generateFill({
          ids: [23],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M212.91 418.116C220.851 375.099 213.052 352.647 211.762 346.432C208.492 330.674 197 343.409 197 343.409C197 343.409 205.932 360.973 212.91 418.116Z"
        className={`abductor ${generateFill({
          ids: [23],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M93.7917 343.239C99.1974 344.727 142.575 366.361 141.189 374.03C140.918 375.534 141.678 382.433 130.328 403.373C119.745 374.835 99.7253 369.193 98.9713 366.911C96.582 364.17 89.8294 351.209 93.7917 343.239Z"
        className={`adductor ${generateFill({
          ids: [24],
          activePrimary,
          activeSecondary,
        })}`}
      />
      <path
        d="M193.521 343.202C188.115 344.69 144.737 366.324 146.123 373.993C146.395 375.498 145.635 382.397 156.985 403.336C167.568 374.798 187.587 369.156 188.341 366.874C190.731 364.133 197.483 351.172 193.521 343.202Z"
        className={`adductor ${generateFill({
          ids: [24],
          activePrimary,
          activeSecondary,
        })}`}
      />
    </svg>
  )
}

export default Body
