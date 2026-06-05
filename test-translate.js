import translate from 'google-translate-api-x';

const content = `<p><strong>Meeting Overview</strong></p><p>This meeting was the second International Conference on Followership Studies, dedicated to the memory of Malam Aminu Kano, an eminent Nigerian leader. The conference featured several keynote speakers discussing the importance of followership in governance and democracy. Laolu Akande, the founder of Empowered Newswire and deputy executive secretary of PanAfricana Strategic & Policy Research Group (PANAFSTRAG), opened the event by highlighting the decline in political engagement among Nigerians and the need for renewed focus on followership.</p><p></p><p><strong>Followership and Governance Discussion</strong></p><p>The meeting featured presentations from Dr. Sam Amadi and Dr. Bode Gbore on followership and governance. Dr. Bode highlighted that followers should move from being subjects to contributors.</p>`;

async function run() {
  try {
    const res = await translate(content, { to: 'fr' });
    console.log("SUCCESS:");
    console.log(res.text.substring(0, 100));
  } catch(e) {
    console.log("ERROR:", e.message);
  }
}
run();
