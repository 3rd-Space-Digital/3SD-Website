import brahmani_dvd_webp from '../../assets/ispy/items/brahmani_dvd.webp'
import brahmani_dvd_svg from '../../assets/ispy/items/brahmani_dvd.svg'
import andrew_camera_webp from '../../assets/ispy/items/andrew_camera.webp'
import andrew_camera_svg from '../../assets/ispy/items/andrew_camera.svg'
import tomiwa_sewing_webp from '../../assets/ispy/items/tomiwa_sewing.webp'
import tomiwa_sewing_svg from '../../assets/ispy/items/tomiwa_sewing.svg'
import sukriti_bracelet_webp from '../../assets/ispy/items/sukriti_bracelet.webp'
import sukriti_bracelet_svg from '../../assets/ispy/items/sukriti_bracelet.svg'
import rachel_hoodie_webp from '../../assets/ispy/items/rachel_hoodie.webp'
import rachel_hoodie_svg from '../../assets/ispy/items/rachel_hoodie.svg'
import prabhas_earbuds_webp from '../../assets/ispy/items/prabhas_earbuds.webp'
import prabhas_earbuds_svg from '../../assets/ispy/items/prabhas_earbuds.svg'
import julia_balm_webp from '../../assets/ispy/items/julia_balm.webp'
import julia_balm_svg from '../../assets/ispy/items/julia_balm.svg'
import hira_rubix_webp from '../../assets/ispy/items/hira_rubix.webp'
import hira_rubix_svg from '../../assets/ispy/items/hira_rubix.svg'
import haashim_kiwi_webp from '../../assets/ispy/items/haashim_kiwi.webp'
import haashim_kiwi_svg from '../../assets/ispy/items/haashim_kiwi.svg'
import giancarlo_laptop_webp from '../../assets/ispy/items/giancarlo_laptop.webp'
import giancarlo_laptop_svg from '../../assets/ispy/items/giancarlo_laptop.svg'
import ethan_journal_webp from '../../assets/ispy/items/ethan_journal.webp'
import ethan_journal_svg from '../../assets/ispy/items/ethan_journal.svg'
import chris_cd_webp from '../../assets/ispy/items/chris_cd.webp'
import chris_cd_svg from '../../assets/ispy/items/chris_cd.svg'

/** Scene size from Figma; item boxes are px in this coordinate system */
export const ISP_SCENE_WIDTH = 1440
export const ISP_SCENE_HEIGHT = 900

/**
 * Positions from src/assets/ispy/items/position notes.txt.
 * imageRotate = degrees on WebP only (SVG outline 0°); values are negated vs Figma notes for web trial.
 *
 * ethan_journal: group box shrunk 15% (×0.85) and re-centered in original Figma rect.
 * zBase (optional): stacking order; journal sits above neighbors that follow it in the DOM.
 */
const ETHAN_W0 = 352.9591
const ETHAN_SHRINK = 0.85
const ETHAN_INSET = (ETHAN_W0 * (1 - ETHAN_SHRINK)) / 2

export const ISP_ITEMS = [
  {
    id: 'brahmani_dvd',
    label: 'DVD',
    left: 565,
    top: 43,
    width: 288,
    height: 288,
    img: brahmani_dvd_webp,
    hitSvg: brahmani_dvd_svg,
  },
  {
    id: 'andrew_camera',
    label: 'Camera',
    left: 1092,
    top: 572,
    width: 300.6155,
    height: 300.6155,
    imageRotate: -90.31,
    img: andrew_camera_webp,
    hitSvg: andrew_camera_svg,
  },
  {
    id: 'tomiwa_sewing',
    label: 'Sewing kit',
    left: 219,
    top: -98,
    width: 385,
    height: 513,
    img: tomiwa_sewing_webp,
    hitSvg: tomiwa_sewing_svg,
  },
  {
    id: 'sukriti_bracelet',
    label: 'Bracelet',
    left: 434,
    top: 648,
    width: 374,
    height: 296,
    img: sukriti_bracelet_webp,
    hitSvg: sukriti_bracelet_svg,
  },
  {
    id: 'rachel_hoodie',
    label: 'Hoodie',
    left: 454,
    top: 329,
    width: 380,
    height: 396,
    img: rachel_hoodie_webp,
    hitSvg: rachel_hoodie_svg,
  },
  {
    id: 'prabhas_earbuds',
    label: 'Earbuds',
    left: 1062,
    top: 364.5,
    width: 252,
    height: 261.5,
    img: prabhas_earbuds_webp,
    hitSvg: prabhas_earbuds_svg,
  },
  {
    id: 'julia_balm',
    label: 'Bag Balm',
    left: 746,
    top: 269,
    width: 337.5062,
    height: 444.1811,
    imageRotate: 1.31,
    img: julia_balm_webp,
    hitSvg: julia_balm_svg,
  },
  {
    id: 'hira_rubix',
    label: "Rubik's cube",
    left: 48,
    top: 136,
    width: 246,
    height: 246.5,
    img: hira_rubix_webp,
    hitSvg: hira_rubix_svg,
  },
  {
    id: 'haashim_kiwi',
    label: 'Cat',
    left: 848,
    top: -8,
    width: 404,
    height: 389.2322,
    imageRotate: -1.25,
    img: haashim_kiwi_webp,
    hitSvg: haashim_kiwi_svg,
  },
  {
    id: 'giancarlo_laptop',
    label: 'Tablet',
    left: 55,
    top: 491,
    width: 398.548,
    height: 313.4607,
    imageRotate: -89.59,
    img: giancarlo_laptop_webp,
    hitSvg: giancarlo_laptop_svg,
  },
  {
    id: 'ethan_journal',
    label: 'Journal & pen',
    zBase: 40,
    left: 235 + ETHAN_INSET,
    top: 213 + ETHAN_INSET,
    width: ETHAN_W0 * ETHAN_SHRINK,
    height: ETHAN_W0 * ETHAN_SHRINK,
    imageRotate: 9.65,
    img: ethan_journal_webp,
    hitSvg: ethan_journal_svg,
  },
  {
    id: 'chris_cd',
    label: 'CD sleeve',
    left: 850,
    top: 626,
    width: 250,
    height: 245,
    img: chris_cd_webp,
    hitSvg: chris_cd_svg,
  },
]
