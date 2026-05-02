/**
 * First-person blurbs shown after a correct item ↔ officer match (keyed by scene item id).
 */
export const ISP_REVEALS_BY_ITEM_ID = {
  tomiwa_sewing:
    'My sewing kit represents any and all sewing projects I’ve done and my progression towards becoming a fashion designer. It’s my constant reminder to keep creating.',

  julia_balm:
    'As a girly with a part-time job whose tasks often involve washing dishes, this balm is a GREAT way to counteract the dry, cracked hands that are a result from relentless labor. :3 these are a game changer for anybody who is in need of more moistness in their daily life',

  andrew_camera:
    'This is my special item, my Sony A6700. I have been using this camera for almost 3 years now and it has carried my business. It is way better than my previous camera and it was my best, and biggest, purchase ever.',

  sukriti_bracelet:
    'this is a bangle, or chudi, that my grandfather gave to me as a gift. this is one of the last things he gave me before he passed, and it’s special to me because it reminds me of everything he was. I wear it all the time so that he is always with me.',

  giancarlo_laptop:
    "My special item is my digital drawing tablet. I've had it for about 3 years now and to me it's one of the most pivotal pieces I have to my name. As an art hobbyist I've been able to really grow and explore my skills simply because it's another way to tap into my creativity",

  haashim_kiwi:
    'This is my socially awkward cat kiwi. He likes sleeping a lot and he’s pretty stupid. His fav thing in the world is bubbles.',

  hira_rubix:
    'It’s special to me because I’ve had it for 8 years, it’s honestly one of my coolest talents. It’s also a stress reliever. Whenever I solve it, I feel more focused and ready to take on whatever’s stressing me out, whether that’s a test or just life in general',

  prabhas_earbuds:
    'I produce and mix music on my phone and these headphones have been letting me do that for 5 years now with it’s stellar quality microphone. I also can’t use overear headphones because my helix piercing hasn’t healed.',

  chris_cd:
    'This CD holds a special place in my heart, and is definitely one of these rarest finds from a early 2000’s straight edge hardcore band. XOne FithX is a staple as one of the earliest straight edge melodic metalcore/screamo/hardcore bands, making one of the biggest impacts to what the SXE sound & culture is now. This is their 2001 demo, limited layout & drop “brandons going to jail” only so many of these were made, with a special inlay & cover. Tallahassee Legends.',

  ethan_journal:
    'Vintage Italian leather notebook embossed with the Three Graces from Greek mythology. I carry this around everywhere and use it to keep a log of my thoughts, feelings, and goals. I also use it for miscellaneous things like to-do lists, sketches, and shopping lists.',

  rachel_hoodie:
    "This hoodie is merch from a dance team I used to be on. I made precious memories and met some really cool people during my time on the team. It reminds me of that special time in my life so that's why it's an important item for me",

  brahmani_dvd:
    "This is a picture of a CD that contains my favorite songs (mixtape. It's important to me because I use multiple collections of CDs (mix tapes, albums, etc.) to listen to my favorite songs in my car. Since I have an old car I don't have any music platforms on my phone, the only time I listen to music is in my car and it's very peaceful, calming, and I'm able to enjoy any carride.",
}

export function getRevealByItemId(itemId) {
  return ISP_REVEALS_BY_ITEM_ID[itemId]
}
