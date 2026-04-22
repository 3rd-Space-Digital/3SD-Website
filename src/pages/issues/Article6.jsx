/* eslint-disable react/prop-types */
import { useState, useEffect, useLayoutEffect, useCallback, useRef, useMemo } from 'react'
import {
  prepareWithSegments,
  layout as pretextLayout,
  layoutNextLineRange,
  materializeLineRange
} from '@chenglou/pretext'
import { useNavigate, Link } from 'react-router-dom'
import { getArticleById } from '../../utils/issuesUtils'
import LoadingScreen from '../../components/LoadingScreen'
import './Article6.css'
import heroImage from './Article6Images/hero.jpg'
import flowerRed from './Article6Images/red.png'
import flowerWhite from './Article6Images/white.png'
import flowerPurple from './Article6Images/purple.png'
import flowerYellow from './Article6Images/yellow.png'
import kf1Image from './Article6Images/KF 1.png'
import kf2Image from './Article6Images/KF 2.png'
import kf3Image from './Article6Images/KF 3.png'
import kf4Image from './Article6Images/KF 4.png'
import kf5Image from './Article6Images/KF 5.png'
import kf6Image from './Article6Images/KF 6.png'
import kf7Image from './Article6Images/KF 7.png'
import kf8Image from './Article6Images/KF 8.png'
import kf9Image from './Article6Images/KF 9.png'
import kf10Image from './Article6Images/KF 10.png'
import kf11Image from './Article6Images/KF 11.png'
import kf12Image from './Article6Images/KF 12.png'

const ARTICLE_ID = '6'

const FLOWER_IMAGES = [flowerRed, flowerWhite, flowerPurple, flowerYellow]
const FLOWER_COLUMNS_PER_SIDE = 1
const FLOWER_ITEMS_PER_COLUMN = 28

const FLOWER_KF_IMAGES = {
  1: kf1Image,
  2: kf2Image,
  3: kf3Image,
  4: kf4Image,
  5: kf5Image,
  6: kf6Image,
  7: kf7Image,
  8: kf8Image,
  9: kf9Image,
  10: kf10Image,
  11: kf11Image,
  12: kf12Image
}

/**
 * KF 1..12 from `scripts/KF-polygons-50-points.txt` (50 samples each, viewBox 960×600).
 * Index 0 unused so FLOWER_POLYGONS[1] === KF 1.
 */
const FLOWER_POLYGONS = [
  '',
  'polygon(54.95% 47.83%, 55.08% 48.89%, 55.14% 49.95%, 55% 51%, 54.76% 51.99%, 54.43% 52.94%, 54.05% 53.82%, 53.66% 54.69%, 53.24% 55.54%, 52.8% 56.35%, 52.33% 57.11%, 51.83% 57.82%, 51.28% 58.27%, 50.62% 58.04%, 49.96% 57.81%, 49.31% 57.59%, 48.65% 57.37%, 47.99% 57.14%, 47.34% 56.89%, 46.69% 56.59%, 46.12% 56.03%, 45.49% 55.68%, 45.05% 55.01%, 44.85% 53.99%, 44.97% 52.94%, 44.9% 51.88%, 44.84% 50.81%, 44.84% 49.74%, 44.91% 48.67%, 45% 47.6%, 45.1% 46.54%, 45.16% 45.47%, 45.29% 44.47%, 45.71% 43.63%, 46.34% 43.29%, 46.96% 42.88%, 47.51% 42.27%, 48.16% 42.17%, 48.83% 42.17%, 49.51% 42.17%, 50.18% 42.17%, 50.85% 42.3%, 51.51% 42.42%, 52.19% 42.42%, 52.83% 42.59%, 53.44% 43.05%, 53.74% 43.99%, 54.03% 44.96%, 54.34% 45.91%, 54.65% 46.87%)',
  'polygon(53.59% 55.92%, 53.17% 56.79%, 52.74% 57.67%, 52.12% 58.09%, 51.45% 58.41%, 50.77% 58.58%, 50.08% 58.58%, 49.39% 58.56%, 48.72% 58.23%, 48.06% 57.9%, 47.41% 57.5%, 46.77% 57.07%, 46.11% 56.75%, 45.53% 56.21%, 45.09% 55.37%, 44.64% 54.52%, 44.47% 53.46%, 44.34% 52.36%, 44.27% 51.26%, 44.27% 50.15%, 44.32% 49.05%, 44.44% 47.95%, 44.56% 46.86%, 44.82% 45.83%, 45.11% 44.82%, 45.43% 43.85%, 46% 43.23%, 46.57% 42.6%, 47.23% 42.25%, 47.9% 41.95%, 48.57% 41.69%, 49.26% 41.53%, 49.95% 41.37%, 50.63% 41.45%, 51.32% 41.6%, 52% 41.78%, 52.57% 42.42%, 53.14% 43.06%, 53.67% 43.76%, 54.06% 44.68%, 54.45% 45.6%, 54.73% 46.59%, 54.85% 47.68%, 54.97% 48.78%, 55% 49.89%, 55% 51%, 54.89% 52.09%, 54.74% 53.18%, 54.43% 54.14%, 54.01% 55.03%)',
  'polygon(53.91% 57.33%, 53.24% 57.99%, 52.56% 58.65%, 51.87% 59.17%, 51.08% 59.17%, 50.3% 59.17%, 49.51% 59.12%, 48.75% 58.83%, 47.98% 58.54%, 47.28% 58.02%, 46.62% 57.34%, 45.96% 56.66%, 45.47% 55.68%, 45% 54.66%, 44.53% 53.65%, 44.36% 52.45%, 44.27% 51.2%, 44.18% 49.95%, 44.17% 48.7%, 44.17% 47.44%, 44.17% 46.18%, 44.45% 45.02%, 44.78% 43.88%, 45.17% 42.83%, 45.88% 42.29%, 46.59% 41.75%, 47.3% 41.23%, 48.08% 41.02%, 48.85% 40.8%, 49.63% 40.59%, 50.41% 40.58%, 51.2% 40.58%, 51.99% 40.58%, 52.7% 41.12%, 53.4% 41.68%, 54.06% 42.34%, 54.6% 43.24%, 55.15% 44.15%, 55.46% 45.28%, 55.72% 46.48%, 55.97% 47.67%, 56.3% 48.81%, 56.66% 49.93%, 56.98% 51.06%, 56.98% 52.32%, 56.98% 53.58%, 56.39% 54.29%, 55.71% 54.92%, 55.06% 55.63%, 54.48% 56.48%)',
  'polygon(53.23% 41%, 52.46% 40.6%, 51.7% 40.21%, 50.92% 39.92%, 50.12% 39.91%, 49.35% 40.21%, 48.62% 40.75%, 47.91% 41.35%, 47.22% 42.01%, 46.53% 42.67%, 45.84% 43.33%, 45.32% 44.26%, 44.91% 45.36%, 44.61% 46.55%, 44.35% 47.77%, 44.32% 49.04%, 44.35% 50.33%, 44.49% 51.59%, 44.73% 52.81%, 45.03% 54%, 45.47% 55.08%, 45.93% 56.14%, 46.53% 56.98%, 47.15% 57.8%, 47.78% 58.61%, 48.44% 59.29%, 49.23% 59.5%, 50.02% 59.6%, 50.78% 59.19%, 51.52% 58.71%, 52.21% 58.05%, 52.91% 57.42%, 53.64% 56.87%, 54.39% 56.5%, 55.19% 56.5%, 55.98% 56.35%, 56.7% 55.79%, 57.29% 55.03%, 57.61% 53.85%, 57.78% 52.63%, 57.7% 51.35%, 57.61% 50.08%, 57.29% 48.91%, 56.91% 47.78%, 56.39% 46.8%, 55.87% 45.83%, 55.39% 44.79%, 54.92% 43.75%, 54.37% 42.82%, 53.8% 41.91%)',
  'polygon(56.77% 58.25%, 55.8% 58.25%, 54.84% 58.25%, 53.96% 58.77%, 53.15% 59.59%, 52.35% 60.47%, 51.59% 61.42%, 50.73% 61.92%, 49.76% 61.92%, 48.83% 61.67%, 47.96% 61.01%, 47.13% 60.22%, 46.36% 59.28%, 45.6% 58.34%, 44.93% 57.22%, 44.27% 56.09%, 43.94% 54.64%, 43.61% 53.18%, 43.49% 51.67%, 43.49% 50.12%, 43.51% 48.58%, 43.65% 47.05%, 43.79% 45.52%, 44.12% 44.11%, 44.66% 42.82%, 45.26% 41.62%, 45.96% 40.56%, 46.68% 39.53%, 47.55% 38.85%, 48.42% 38.17%, 49.3% 37.61%, 50.26% 37.8%, 51.21% 37.98%, 52.14% 38.37%, 53.03% 38.98%, 53.92% 39.6%, 54.67% 40.57%, 55.42% 41.54%, 56.1% 42.62%, 56.71% 43.82%, 57.33% 45.01%, 57.99% 46.15%, 58.55% 47.4%, 59.03% 48.74%, 59.06% 50.27%, 59.06% 51.82%, 58.91% 53.32%, 58.58% 54.77%, 58.21% 56.19%, 57.49% 57.22%)',
  'polygon(57.19% 58.67%, 56.15% 59.36%, 55.11% 60.05%, 54.07% 60.74%, 53.15% 61.79%, 52.24% 62.84%, 51.37% 63.99%, 50.27% 64.08%, 49.14% 64.08%, 48.14% 63.42%, 47.19% 62.46%, 46.23% 61.5%, 45.28% 60.55%, 44.64% 59.17%, 44.22% 57.5%, 43.94% 55.76%, 43.7% 54%, 43.48% 52.23%, 43.34% 50.45%, 43.2% 48.66%, 43.2% 46.87%, 43.36% 45.09%, 43.59% 43.34%, 44.08% 41.73%, 44.58% 40.11%, 45.19% 38.63%, 46.01% 37.39%, 46.83% 36.15%, 47.85% 35.49%, 48.93% 34.95%, 50.01% 34.53%, 51.12% 34.76%, 52.24% 34.99%, 53.25% 35.68%, 54.18% 36.69%, 55.11% 37.71%, 56.02% 38.77%, 56.91% 39.85%, 57.74% 41.04%, 58.19% 42.68%, 58.65% 44.33%, 59.31% 45.79%, 59.97% 47.25%, 60.42% 48.88%, 60.78% 50.58%, 60.68% 52.31%, 60.39% 54.06%, 60% 55.67%, 59.06% 56.67%, 58.12% 57.67%)',
  'polygon(55.1% 61.92%, 54.01% 63.07%, 52.91% 64.23%, 51.96% 65.65%, 51.1% 67.23%, 49.86% 67.83%, 48.82% 66.77%, 47.83% 65.39%, 46.7% 64.34%, 45.56% 63.29%, 44.51% 62.07%, 43.64% 60.5%, 42.78% 58.92%, 42.1% 57.14%, 41.51% 55.26%, 41.41% 53.2%, 41.41% 51.1%, 41.43% 49.01%, 41.63% 46.93%, 41.86% 44.87%, 42.38% 42.94%, 42.89% 41.01%, 43.69% 39.34%, 44.5% 37.69%, 45.47% 36.31%, 46.54% 35.09%, 47.61% 33.88%, 48.84% 33.3%, 50.14% 32.93%, 51.43% 32.76%, 52.72% 33.09%, 54.02% 33.42%, 55.18% 34.23%, 56.19% 35.57%, 57.21% 36.9%, 58.09% 38.45%, 58.95% 40.04%, 59.72% 41.73%, 60.37% 43.55%, 60.94% 45.42%, 61.19% 47.48%, 61.48% 49.52%, 61.97% 51.47%, 62.08% 53.53%, 61.73% 55.35%, 60.69% 56.63%, 59.58% 57.71%, 58.35% 58.46%, 57.16% 59.31%, 56.13% 60.61%)',
  'polygon(53.23% 69.08%, 51.74% 69.93%, 50.25% 70.75%, 48.68% 70.75%, 47.14% 70.27%, 45.73% 69.23%, 44.45% 67.76%, 43.28% 66.13%, 42.43% 63.99%, 41.59% 61.86%, 40.75% 59.72%, 39.91% 57.59%, 39.43% 55.21%, 39.08% 52.76%, 39.36% 50.27%, 39.65% 47.79%, 40.08% 45.37%, 40.57% 42.97%, 41.06% 40.57%, 41.72% 38.29%, 42.49% 36.09%, 43.39% 34.03%, 44.43% 32.13%, 45.64% 30.59%, 47.04% 29.41%, 48.47% 28.43%, 50.03% 28.09%, 51.6% 27.76%, 53.05% 28.48%, 54.47% 29.59%, 55.88% 30.71%, 57.15% 32.18%, 58.31% 33.89%, 59.35% 35.75%, 60.19% 37.89%, 61.02% 40.03%, 61.84% 42.19%, 62.6% 44.39%, 62.98% 46.84%, 63.36% 49.29%, 63.76% 51.73%, 63.55% 54.03%, 62.75% 56.21%, 61.83% 58.22%, 60.62% 59.84%, 59.41% 61.46%, 58.27% 63.19%, 57.15% 64.98%, 56.02% 66.73%, 54.62% 67.91%)',
  'polygon(59.74% 66.25%, 58.3% 68.02%, 56.85% 69.79%, 55.19% 70.97%, 53.53% 72.13%, 51.83% 73.16%, 50.08% 73.97%, 48.35% 73.81%, 46.66% 72.73%, 45.2% 71.02%, 43.74% 69.27%, 42.29% 67.53%, 40.88% 65.69%, 39.53% 63.74%, 38.28% 61.63%, 37.17% 59.32%, 37.14% 56.43%, 37.14% 53.52%, 37.26% 50.62%, 37.44% 47.73%, 37.87% 44.92%, 38.42% 42.14%, 38.91% 39.34%, 39.39% 36.53%, 40.29% 34.07%, 41.45% 31.84%, 42.84% 30.01%, 44.4% 28.52%, 46% 27.15%, 47.68% 26.05%, 49.38% 25.08%, 51.2% 25.08%, 53.02% 25.08%, 54.74% 25.87%, 56.44% 26.93%, 57.92% 28.49%, 59.17% 30.61%, 60.31% 32.86%, 61.36% 35.23%, 62.25% 37.75%, 62.95% 40.44%, 63.51% 43.2%, 63.96% 46.02%, 64.43% 48.83%, 64.9% 51.65%, 64.76% 54.46%, 64.32% 57.29%, 63.3% 59.63%, 62.11% 61.83%, 60.92% 64.04%)',
  'polygon(57.5% 71.58%, 55.82% 73.38%, 54.07% 74.99%, 52.23% 76.17%, 50.2% 76.17%, 48.18% 76.17%, 46.33% 75.08%, 44.71% 73.21%, 43.21% 71.07%, 41.51% 69.32%, 39.92% 67.32%, 38.54% 64.98%, 37.25% 62.5%, 35.96% 60.01%, 34.86% 57.3%, 34.43% 54.22%, 34.64% 51%, 35.14% 47.9%, 35.86% 44.88%, 36.44% 41.78%, 37.3% 38.88%, 38.25% 36.03%, 39.17% 33.15%, 40.36% 30.55%, 41.68% 28.1%, 43.17% 25.93%, 44.91% 24.27%, 46.82% 23.34%, 48.8% 22.66%, 50.81% 22.5%, 52.78% 22.71%, 54.43% 24.59%, 56.1% 26.39%, 57.72% 28.29%, 58.95% 30.85%, 60.57% 32.72%, 61.97% 34.92%, 63% 37.7%, 63.81% 40.66%, 65.18% 43.02%, 65.86% 45.97%, 66.04% 49.17%, 66.19% 52.38%, 66.52% 55.5%, 65.79% 58.52%, 64.34% 60.35%, 62.65% 61.86%, 61.6% 64.62%, 60.46% 67.29%, 59.12% 69.64%)',
  'polygon(67.55% 52.5%, 67.55% 48.76%, 66.92% 45.17%, 66.23% 41.59%, 65.55% 38.02%, 64.94% 34.41%, 63.56% 31.41%, 62.15% 28.43%, 60.88% 25.29%, 59.01% 23.06%, 56.99% 21.22%, 54.82% 19.96%, 52.5% 20.39%, 50.18% 20.83%, 47.87% 21.44%, 45.57% 22.08%, 43.28% 22.88%, 41.12% 24.06%, 39.38% 26.54%, 37.88% 29.38%, 36.56% 32.47%, 35.29% 35.61%, 34.09% 38.82%, 33.14% 42.22%, 32.23% 45.67%, 31.16% 48.99%, 30.99% 52.66%, 31.25% 56.31%, 32.3% 59.64%, 33.39% 62.95%, 34.56% 66.19%, 35.89% 69.26%, 37.27% 72.28%, 39.29% 74.15%, 41.21% 76.26%, 43.16% 78.27%, 45.32% 79.73%, 47.64% 79.83%, 49.96% 79.5%, 52.26% 78.86%, 54.6% 78.83%, 56.92% 78.53%, 59.19% 77.7%, 60.48% 74.59%, 61.64% 71.35%, 63.38% 68.93%, 64.72% 65.97%, 65.94% 62.79%, 67.26% 59.74%, 67.95% 56.18%)',
  'polygon(68.33% 46%, 68.33% 49.77%, 68.19% 53.54%, 67.98% 57.3%, 66.87% 60.62%, 65.32% 63.45%, 63.94% 66.49%, 62.77% 69.76%, 61.58% 73.02%, 60.18% 75.98%, 58.27% 78.2%, 56.07% 79.26%, 53.73% 79.79%, 51.41% 80.42%, 49.1% 81.18%, 46.84% 81.61%, 44.77% 79.81%, 42.87% 77.62%, 41.1% 75.14%, 39.06% 73.23%, 37.31% 70.76%, 35.77% 67.91%, 34.32% 64.93%, 33.49% 61.4%, 32.04% 58.46%, 30.93% 55.25%, 30.33% 51.6%, 30.26% 47.84%, 30.94% 44.4%, 32.28% 41.29%, 33.64% 38.2%, 34.93% 35.04%, 36.17% 31.84%, 37.66% 28.91%, 39.44% 26.52%, 41.47% 24.61%, 43.76% 23.75%, 46.06% 22.88%, 48.27% 21.58%, 50.54% 20.75%, 52.9% 20.75%, 55.23% 21.16%, 57.56% 21.81%, 59.42% 24.09%, 61.07% 26.71%, 62.23% 30%, 63.59% 33.08%, 64.98% 36.13%, 66.4% 39.14%, 67.44% 42.51%)'
]

/** KF indices for the opening half: 1 → 12. */
const FLOWER_POLYGON_PLAY_FORWARD = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

/** Return leg: 11 → 1 (KF 12 was the last frame of forward). */
const FLOWER_POLYGON_PLAY_REVERSE = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

const ARTICLE_BODY_SINGLE_PARAGRAPH = [
  `Ask the question, “Would you from one year ago like who you are now?” `,
  `How about two years? Then go back as far as five years ago and ask the same question. A few would say yes, some would say no, and a lot would say maybe and talk about tiny comparisons, old expectations, or about their younger selves’s dreams and goals. `,
  `Now ask the question, “Do you like the you now more than the you from a year ago?” `,
  `How about two years? Five years ago? A lot would say yes, some would say no, and a few would point out the nuances about how life was back then, how simple it was, the people they were surrounded by, going on tangent about the things that happened in high school, hinting at the fact they peaked. But the question was about yourself, not anything or anyone else. `,
  `Despite these different answers, you look back on the past and reflect and wonder “when did it all change?”. Then you start replaying all your phases, past relationships, crazy and not so crazy exes, stupid decisions and then great ones, goals and career expectations, so on and so forth. It's a lot. A lot of change stacked on top of itself. `,
  `But despite all of it, some people still feel stuck. `,
  `And that's the confusing part. On paper, everything changed. You changed environments, people, habits, maybe even your goals you were dead set on. You can clearly spot differences between who you were and who you are now. But internally, there's this quiet feeling that nothing has really moved. Like you're carrying the same weight, maybe even more, but just in a different setting. `,
  `That's where growing pains live. We know growth isn't always loud or obvious. It's not always about leveling up or becoming this completely new person overnight. Sometimes it looks like sitting with things you used to avoid. Sometimes it's realizing patterns in yourself that you can't unsee anymore. Sometimes it's understanding why you are the way you are and not being able to blame it on ignorance, life situation, or your parents or anyone for that matter. `,
  `And that's the part that hurts more than the obvious and life changing events that've already happened in life. Because maturing isn't just adding these new objects, friends, hobbies, lifestyles, these things, these layers. It's also peeling them back. `,
  `There's a reason why therapy exists. Not because people are broken, but because looking inward is very uncomfortable. You start digging, and suddenly you're not just dealing with the present. You're unearthing old versions of yourself, old wounds, old beliefs you didn't even realize were still shaping you that you refuse to accept and acknowledge. You realize why you react the way you do, why certain things still affect you, why you've been holding onto things longer than you should. And once you see it, you can't unsee it, just as the same way you were before: blindfolded from your own truths because you choose to see otherwise. `,
  `But now you do. A part of you knows the direction you're moving toward. Another part feels completely unprepared. And that tension, that in between, is so exhausting. You're no longer comfortable being the old version of yourself, but the new version isn't stable yet. So you exist in this middle space. This Limbo. `,
  `Maturity is often imagined as confidence, stability, certainty. But the process of getting there looks nothing like that. Doubt. Confusion. Identity. Frustration. Failures. Unclear Emotions. And somehow, we expect ourselves to arrive there immediately. Healthy, emotionally stable, successful, and certain of our future. `,
  `But what's the big time rush? That's not how growth works. We're allowed to be in the middle of becoming, we don't have to have everything figured out just because we've started figuring things out. We're asked as college students, as early adults to make permanent decisions while we're still forming our identity. `,
  `“Choose a career. Choose your path. Choose your people. Choose your future” `,
  `All the while still trying to understand who you even are. It's like building a car while learning to drive it. `,
  `That's why it feels so uncomfortable. Not because you're doing something wrong, but because you're doing something strange, something normally accepted but ignored, something natural. `,
  `Because you're becoming someone you’ve never been before. But there's something quietly beautiful about it, because uncovering uncomfortable truths, you're getting closer to something real. Not the version of you shaped by expectations, or phases, or other people. Something more honest, something chosen. `,
  `And despite everything, despite every phase, every mistake, every version of you that came and went. `,
  `You’re still you. `,
  `Not the exact same, but not completely different either. `,
  `More aware. More layered. More real.`
].join('')

const FlowerRail = ({ side }) => {
  const columns = Array.from({ length: FLOWER_COLUMNS_PER_SIDE }, (_, columnIndex) => {
    const items = Array.from({ length: FLOWER_ITEMS_PER_COLUMN }, (_, i) => {
      const src = FLOWER_IMAGES[(i + columnIndex) % FLOWER_IMAGES.length]
      return (
        <img
          key={`${side}-img-${columnIndex}-${i}`}
          className="article6-flower"
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
        />
      )
    })

    return (
      <div key={`${side}-col-${columnIndex}`} className="article6-flower-col" aria-hidden="true">
        <div className="article6-flower-track">{items}</div>
      </div>
    )
  })

  return (
    <div className={`article6-flower-rail article6-flower-rail--${side}`} aria-hidden="true">
      {columns}
    </div>
  )
}

/** Forward + reverse (3× faster than the original 12s + 12s). */
const FLOWER_SLOT_FORWARD_MS = 1333
const FLOWER_SLOT_REVERSE_MS = 1333
const FLOWER_SLOT_TOTAL_MS = FLOWER_SLOT_FORWARD_MS + FLOWER_SLOT_REVERSE_MS

/**
 * Pretext canvas font must match `.article6-body` paragraph typography.
 * Avoid `system-ui` in the font string (Pretext docs / macOS accuracy).
 */
const ARTICLE6_PRETEXT_FONT = '500 18px Inter, sans-serif'
const ARTICLE6_PRETEXT_LINE_HEIGHT = 18 * 1.6

/** clip-path %: x vs element width, y vs element height — tight box around polygon bbox. */
const FLOWER_TIGHT_MAX_WIDTH_FRAC = 0.46
const FLOWER_TIGHT_MAX_HEIGHT_FRAC = 0.38
/** Applied to uniform viewBox scale `k` (1 = fill caps). Use 1/5 to undo a prior 5× size boost. */
const FLOWER_POLYGON_SCREEN_SCALE = 2
/** Keep body text this many px away from the polygon silhouette (not 0-tight). */
const FLOWER_SHAPE_TEXT_MARGIN_PX = 5
/** Extra inset for glyph ink past advances (Pretext widths are still advance-based). */
const FLOWER_GLYPH_INK_PAD_PX = 5
/**
 * Only extend the split band *below* the polygon bbox by a few px so an occasional line
 * is not left full-width under the slot. Do not use the full slot height — that splits
 * every line through the square and creates a full-page “dead strip”.
 */
const FLOWER_SPLIT_SLOP_BELOW_PX = 24

/** Must match the viewBox of the SVG used with `scripts/svg-to-polygon.mjs` for this polygon. */
const FLOWER_POLYGON_VIEWBOX = { width: 960, height: 600 }

function parsePolygonPercentPoints(polygonCss) {
  const m = polygonCss.match(/polygon\s*\(\s*([^)]+)\s*\)/i)
  if (!m) return null
  const pts = []
  for (const chunk of m[1].split(/\s*,\s*/)) {
    const pair = chunk.trim().match(/^([\d.]+)%\s+([\d.]+)%$/i)
    if (pair) pts.push({ x: parseFloat(pair[1]), y: parseFloat(pair[2]) })
  }
  return pts.length >= 3 ? pts : null
}

function polygonBBox(points) {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const p of points) {
    minX = Math.min(minX, p.x)
    maxX = Math.max(maxX, p.x)
    minY = Math.min(minY, p.y)
    maxY = Math.max(maxY, p.y)
  }
  return { minX, maxX, minY, maxY }
}

/**
 * Bounding box (viewBox %) that contains every KF. Used only for slot pixel size — if we
 * sized the slot from each frame’s bbox, `k` would shrink as the path grows and every frame
 * would hit the same maxW/maxH cap (no visible “opening”).
 */
const FLOWER_POLYGON_UNION_BBOX = (() => {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (let i = 1; i < FLOWER_POLYGONS.length; i += 1) {
    const pts = parsePolygonPercentPoints(FLOWER_POLYGONS[i])
    if (!pts) continue
    const b = polygonBBox(pts)
    minX = Math.min(minX, b.minX)
    maxX = Math.max(maxX, b.maxX)
    minY = Math.min(minY, b.minY)
    maxY = Math.max(maxY, b.maxY)
  }
  if (!Number.isFinite(minX)) return { minX: 0, maxX: 100, minY: 0, maxY: 100 }
  return { minX, maxX, minY, maxY }
})()

function clampNvForPolygon(yPercent, bbox) {
  return Math.min(bbox.maxY - 0.02, Math.max(bbox.minY + 0.02, yPercent))
}

function lineYToNvPercent(lineY, boxTop, boxHeight, bbox) {
  if (boxHeight <= 0) return clampNvForPolygon(50, bbox)
  return clampNvForPolygon(((lineY - boxTop) / boxHeight) * 100, bbox)
}

function polygonHorizontalSpanAtY(points, yPercent) {
  const eps = 1e-5
  const xs = []
  const n = points.length
  for (let i = 0; i < n; i += 1) {
    const a = points[i]
    const b = points[(i + 1) % n]
    const y0 = a.y
    const y1 = b.y
    if (Math.abs(y0 - y1) < eps) continue
    const lo = Math.min(y0, y1)
    const hi = Math.max(y0, y1)
    if (yPercent <= lo || yPercent > hi) continue
    const t = (yPercent - y0) / (y1 - y0)
    xs.push(a.x + t * (b.x - a.x))
  }
  xs.sort((u, v) => u - v)
  if (xs.length < 2) return null
  return { xMin: xs[0], xMax: xs[xs.length - 1] }
}

/** Union horizontal span across several Y samples so ascenders/descenders stay clear. */
function mergedPolygonSpanForLine(polyPts, bbox, boxTop, boxHeight, lineTop, lineBottom) {
  const midY = (lineTop + lineBottom) / 2
  const samples = [
    lineYToNvPercent(lineTop, boxTop, boxHeight, bbox),
    lineYToNvPercent(midY, boxTop, boxHeight, bbox),
    lineYToNvPercent(lineBottom, boxTop, boxHeight, bbox)
  ]
  let xMin = Infinity
  let xMax = -Infinity
  for (const nv of samples) {
    const span = polygonHorizontalSpanAtY(polyPts, nv)
    if (!span) continue
    xMin = Math.min(xMin, span.xMin)
    xMax = Math.max(xMax, span.xMax)
  }
  if (!Number.isFinite(xMin) || !Number.isFinite(xMax)) return null
  return { xMin, xMax }
}

/**
 * Pixel box for the flower slot: `bbox` should be `FLOWER_POLYGON_UNION_BBOX` so the element
 * is large enough for every keyframe. Polygon % coords are relative to the full viewBox
 * (`FLOWER_POLYGON_VIEWBOX`); one uniform `k` preserves SVG aspect.
 */
function computeTightFlowerBox(deckW, totalH, bbox) {
  const rX = Math.max(0.001, (bbox.maxX - bbox.minX) / 100)
  const rY = Math.max(0.001, (bbox.maxY - bbox.minY) / 100)
  const maxW = deckW * FLOWER_TIGHT_MAX_WIDTH_FRAC
  const maxH = Math.max(72, totalH * FLOWER_TIGHT_MAX_HEIGHT_FRAC)
  const { width: vbW, height: vbH } = FLOWER_POLYGON_VIEWBOX
  const bboxW = rX * vbW
  const bboxH = rY * vbH
  const k = Math.min(maxW / bboxW, maxH / bboxH) * FLOWER_POLYGON_SCREEN_SCALE
  const boxW = vbW * k
  const boxH = vbH * k
  const cx = deckW / 2
  const cy = totalH / 2
  const boxLeft = cx - boxW / 2
  const boxTop = cy - boxH / 2
  const boxBottom = boxTop + boxH
  return { boxW, boxH, boxLeft, boxTop, boxBottom, cx, cy, rX, rY }
}

function findStackSplitIndex(input) {
  const target = Math.floor(input.length * 0.5)
  const dotBefore = input.lastIndexOf('.', target)
  const dotAfter = input.indexOf('.', target)
  if (dotBefore >= 0 && (dotAfter < 0 || target - dotBefore <= dotAfter - target)) {
    return Math.min(input.length, dotBefore + 1)
  }
  if (dotAfter >= 0) return Math.min(input.length, dotAfter + 1)
  return target
}

function Article6FlowerParagraph({ text }) {
  const deckRef = useRef(null)
  const slotRef = useRef(null)
  const [activePolygon, setActivePolygon] = useState(() => FLOWER_POLYGONS[1])
  const [activeKf, setActiveKf] = useState(1)
  const [layout, setLayout] = useState(null)
  const [fontRev, setFontRev] = useState(0)
  const prepared = useMemo(() => {
    try {
      return prepareWithSegments(text, ARTICLE6_PRETEXT_FONT)
    } catch {
      return null
    }
  }, [text, fontRev])

  useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts?.ready) {
      setFontRev(1)
      return
    }
    let cancelled = false
    document.fonts.ready.then(() => {
      if (!cancelled) setFontRev((n) => n + 1)
    })
    return () => {
      cancelled = true
    }
  }, [text])

  const rafRef = useRef(null)
  const startRef = useRef(0)
  const animatingRef = useRef(false)

  const cancelAnim = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    animatingRef.current = false
  }, [])

  const tick = useCallback(
    (now) => {
      const elapsed = now - startRef.current

      if (elapsed >= FLOWER_SLOT_TOTAL_MS) {
        cancelAnim()
        setActivePolygon(FLOWER_POLYGONS[1])
        setActiveKf(1)
        return
      }

      let kf = 1
      if (elapsed < FLOWER_SLOT_FORWARD_MS) {
        const order = FLOWER_POLYGON_PLAY_FORWARD
        const n = order.length
        const stepMs = FLOWER_SLOT_FORWARD_MS / Math.max(1, n - 1)
        const stepIndex = Math.min(n - 1, Math.floor(elapsed / stepMs))
        kf = order[stepIndex]
      } else {
        const t = elapsed - FLOWER_SLOT_FORWARD_MS
        const order = FLOWER_POLYGON_PLAY_REVERSE
        const n = order.length
        const stepMs = FLOWER_SLOT_REVERSE_MS / Math.max(1, n - 1)
        const stepIndex = Math.min(n - 1, Math.floor(t / stepMs))
        kf = order[stepIndex]
      }

      setActivePolygon(FLOWER_POLYGONS[kf] || FLOWER_POLYGONS[1])
      setActiveKf(kf)
      rafRef.current = requestAnimationFrame(tick)
    },
    [cancelAnim]
  )

  const startAnim = useCallback(() => {
    cancelAnim()
    animatingRef.current = true
    startRef.current = performance.now()
    setActivePolygon(FLOWER_POLYGONS[FLOWER_POLYGON_PLAY_FORWARD[0]])
    setActiveKf(FLOWER_POLYGON_PLAY_FORWARD[0])
    rafRef.current = requestAnimationFrame(tick)
  }, [cancelAnim, tick])

  useEffect(() => () => cancelAnim(), [cancelAnim])

  const recomputeLayout = useCallback(() => {
    const deck = deckRef.current
    if (!deck || !prepared) return

    const deckW = deck.clientWidth
    if (deckW < 48) return

    const polyPts = parsePolygonPercentPoints(activePolygon)
    const bbox = polyPts ? polygonBBox(polyPts) : { minX: 0, maxX: 100, minY: 0, maxY: 100 }

    const lh = ARTICLE6_PRETEXT_LINE_HEIGHT
    const { height: totalH, lineCount } = pretextLayout(prepared, deckW, lh)
    if (lineCount <= 0 || totalH <= 0) {
      setLayout(null)
      return
    }

    const { boxW, boxH, boxLeft, boxTop, boxBottom, cy, rX } = computeTightFlowerBox(
      deckW,
      totalH,
      FLOWER_POLYGON_UNION_BBOX
    )

    const m = FLOWER_SHAPE_TEXT_MARGIN_PX
    const inkPad = FLOWER_GLYPH_INK_PAD_PX
    const maxGapPx = boxW * rX + (m + inkPad) * 2
    const minSide = deckW / 2
    const leftMaxIfSymmetric = minSide - maxGapPx / 2

    if (leftMaxIfSymmetric < 56) {
      const splitAt = findStackSplitIndex(text)
      setLayout({
        mode: 'stack',
        before: text.slice(0, splitAt).trimStart(),
        after: text.slice(splitAt).trimStart(),
        boxW,
        boxH
      })
      return
    }

    const polyTopDoc = (polyPts ? boxTop + (bbox.minY / 100) * boxH : boxTop) - m
    const polyBottomDoc = (polyPts ? boxTop + (bbox.maxY / 100) * boxH : boxBottom) + m
    const splitBandBottom = Math.min(boxBottom + m, polyBottomDoc + FLOWER_SPLIT_SLOP_BELOW_PX)

    /**
     * Newspaper-style LTR stream (Pretext dynamic layout): one `layoutNextLineRange` per row
     * at full column width, or two calls per row (narrow left, then narrow right) when the
     * row crosses the polygon — cursor always advances through the same prepared paragraph.
     */
    const rows = []
    let cursor = { segmentIndex: 0, graphemeIndex: 0 }
    const maxRows = Math.max(lineCount, 1) * 2 + 32
    let lineIndex = 0

    while (lineIndex < maxRows) {
      const top = lineIndex * lh
      const bottom = top + lh
      const intersects = Boolean(polyPts) && bottom > polyTopDoc && top < splitBandBottom

      if (!intersects) {
        const range = layoutNextLineRange(prepared, cursor, deckW)
        if (!range) break
        rows.push({ kind: 'full', text: materializeLineRange(prepared, range).text })
        cursor = range.end
        lineIndex += 1
        continue
      }

      let span = mergedPolygonSpanForLine(polyPts, bbox, boxTop, boxH, top, bottom)
      if (!span || span.xMax - span.xMin < 0.5) {
        span = { xMin: bbox.minX, xMax: bbox.maxX }
      }

      const ink = FLOWER_GLYPH_INK_PAD_PX
      let xL = boxLeft + (span.xMin / 100) * boxW - m
      let xR = boxLeft + (span.xMax / 100) * boxW + m
      xL = Math.max(0, Math.min(xL, deckW))
      xR = Math.max(0, Math.min(xR, deckW))

      if (xR - xL < m * 2 + 4 || xL >= xR) {
        const range = layoutNextLineRange(prepared, cursor, deckW)
        if (!range) break
        rows.push({ kind: 'full', text: materializeLineRange(prepared, range).text })
        cursor = range.end
        lineIndex += 1
        continue
      }

      const wLeft = Math.max(0, xL - ink)
      const wRight = Math.max(40, deckW - xR - ink)

      const rLeft = layoutNextLineRange(prepared, cursor, wLeft)
      if (!rLeft) break
      const leftText = materializeLineRange(prepared, rLeft).text
      const rRight = layoutNextLineRange(prepared, rLeft.end, wRight)
      const rightText = rRight ? materializeLineRange(prepared, rRight).text : ''

      rows.push({
        kind: 'split',
        left: leftText,
        right: rightText,
        leftPx: xL,
        gapPx: xR - xL,
        rightPx: Math.max(40, deckW - xR),
        inkPad: ink
      })
      cursor = rRight ? rRight.end : rLeft.end
      lineIndex += 1
    }

    setLayout({
      mode: 'hole',
      rows,
      boxW,
      boxH,
      cy
    })
  }, [prepared, text, activePolygon])

  useLayoutEffect(() => {
    recomputeLayout()
  }, [recomputeLayout])

  useEffect(() => {
    const deck = deckRef.current
    if (!deck) return

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            recomputeLayout()
          })
        : null
    ro?.observe(deck)

    const onResize = () => recomputeLayout()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      ro?.disconnect()
    }
  }, [recomputeLayout])

  const handleClick = () => {
    if (animatingRef.current) return
    startAnim()
  }

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    handleClick()
  }

  const deckClass =
    layout != null ? 'article6-flower-deck article6-flower-deck--ready' : 'article6-flower-deck'

  const activeImage = FLOWER_KF_IMAGES[activeKf]
  const flowerButton = layout && (
    <button
      ref={slotRef}
      type="button"
      className={`article6-flower-slot article6-flower-slot--${layout.mode}`}
      style={
        layout.mode === 'hole'
          ? {
              width: layout.boxW,
              height: layout.boxH,
              top: layout.cy
            }
          : {
              width: layout.boxW,
              height: layout.boxH
            }
      }
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label="Play opening animation"
    >
      <span
        className="article6-flower-slot-visual"
        style={
          activeImage
            ? { clipPath: activePolygon, backgroundImage: `url(${activeImage})` }
            : { clipPath: activePolygon }
        }
        aria-hidden="true"
      />
    </button>
  )

  return (
    <div ref={deckRef} className={deckClass}>
      {layout?.mode === 'hole' && (
        <>
          <p className="article6-paragraph article6-paragraph--single article6-flower-body">
            {layout.rows.map((row, i) =>
              row.kind === 'full' ? (
                <span key={`r-${i}`} className="article6-flower-line article6-flower-line--full">
                  {row.text}
                </span>
              ) : (
                <span key={`r-${i}`} className="article6-flower-line article6-flower-line--split">
                  <span
                    className="article6-flower-line__left"
                    style={{
                      flex: `0 0 ${row.leftPx}px`,
                      width: row.leftPx,
                      maxWidth: row.leftPx,
                      boxSizing: 'border-box',
                      paddingRight: row.inkPad
                    }}
                  >
                    {row.left}
                  </span>
                  <span
                    className="article6-flower-line__gap"
                    style={{ flex: `0 0 ${row.gapPx}px`, width: row.gapPx }}
                    aria-hidden="true"
                  />
                  <span
                    className="article6-flower-line__right"
                    style={{
                      flex: `0 0 ${row.rightPx}px`,
                      width: row.rightPx,
                      maxWidth: row.rightPx,
                      boxSizing: 'border-box',
                      paddingLeft: row.inkPad
                    }}
                  >
                    {row.right}
                  </span>
                </span>
              )
            )}
          </p>
          {flowerButton}
        </>
      )}

      {layout?.mode === 'stack' && (
        <div className="article6-flower-stack">
          <p className="article6-paragraph article6-paragraph--single article6-flower-stack-text">{layout.before}</p>
          {flowerButton}
          <p className="article6-paragraph article6-paragraph--single article6-flower-stack-text">{layout.after}</p>
        </div>
      )}
    </div>
  )
}

function Article6() {
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await getArticleById(ARTICLE_ID)
        if (!data) {
          setError('Article not found')
          setLoading(false)
          return
        }
        setArticle(data)
        setError(null)
      } catch (err) {
        console.error('Error loading article:', err)
        setError('Failed to load article')
      } finally {
        setLoading(false)
      }
    }
    load()

    document.body.style.backgroundColor = 'white'
    document.documentElement.style.backgroundColor = 'white'

    return () => {
      document.body.style.removeProperty('background-color')
      document.documentElement.style.removeProperty('background-color')
    }
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return <LoadingScreen text="Loading Issue" />
  }

  if (error || !article) {
    return (
      <div className="article6 article6-error">
        <div className="article6-error-text">
          <h2>{error || 'Article not found'}</h2>
          <Link to="/issues" className="article6-back-link">← Back to Issues</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="article6">
      <div className="article6-nav">
        <button
          type="button"
          className="article6-back"
          onClick={() => navigate('/issues')}
          aria-label="Back to issues"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Issues
        </button>
      </div>

      <header className="article6-header">
        <h1 className="article6-title">{article.title}</h1>
        <div className="article6-meta">
          <span className="article6-date">{formatDate(article.article_date)}</span>
          {article.author && (
            <>
              <span className="article6-sep"> | </span>
              <span className="article6-author">{article.author}</span>
            </>
          )}
        </div>
      </header>

      <div className="article6-main">
        <div className="article6-flower-rails" aria-hidden="true">
          <FlowerRail side="left" />
          <FlowerRail side="right" />
        </div>

        <div className="article6-content">
          <figure className="article6-hero">
            <img
              src={heroImage}
              alt={article.title || 'Issue hero'}
            />
          </figure>
          {article.description && (
            <p className="article6-subtitle">{article.description}</p>
          )}

          <div className="article6-body article6-body--flower-wrap">
            <Article6FlowerParagraph text={ARTICLE_BODY_SINGLE_PARAGRAPH} />
          </div>
        </div>

        <div className="article6-credits">
          <h3 className="article6-credits-title">Credits</h3>
          <div className="article6-credits-grid">
            {article.author && (
              <div className="article6-credit-item">
                <span className="article6-credit-label">Author:</span>
                <span className="article6-credit-value">{article.author}</span>
              </div>
            )}
            <div className="article6-credit-item">
              <span className="article6-credit-label">Interactive Web Design:</span>
              <span className="article6-credit-value">
                <a
                  href="https://www.instagram.com/not.__ethan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article6-credit-link"
                >
                  Ethan Scherwitz
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Article6

