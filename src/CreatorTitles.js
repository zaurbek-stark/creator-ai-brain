import { openai } from './openai.js';
import { useState } from 'react';

const aiModels = {
  mrbeast: "davinci:ft-personal:mrbeast-titles-2022-11-26-19-59-50",
  ryantrahan: "davinci:ft-personal:ryan-trahan-titles-2022-11-26-23-51-38",
  airrack: "davinci:ft-personal:airrack-titles-2022-11-26-23-59-19",
  mrtrack: "davinci:ft-personal:mrtrack-titles-better-2022-11-27-00-48-08"
}

const CreatorTitles = () => {
  const [titles, setTitles] = useState("");
  const [error, setError] = useState("");
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creatorName, setCreatorName] = useState("mrbeast");

  const getData = async (name = creatorName) => {
    try {
      const response = await openai.createCompletion({
        model: aiModels[name],
        prompt: "Write a title for a youtube video!",
        temperature: 0.6,
        max_tokens: 300,
        top_p: 1,
        best_of: 2,
        frequency_penalty: 1,
        presence_penalty: 1,
        stop: ["\\n"]
      });
      setError('');
      setTitles(response.data.choices[0].text);
      setLoadingRefresh(false);
      setLoading(false);
    } catch (e) {
      setError("Error: Sorry, no titles were generated for this creator.")
    }
  };

  const updateCreatorName = (event) => {
    event.preventDefault();
    setLoading(true);
    setCreatorName(event.target[0].value);
    getData(event.target[0].value).then();
  };

  return (
    <>
      <form className='mainForm' onSubmit={updateCreatorName}>
        <select id="creators">
          <option value="mrbeast">MrBeast</option>
          <option value="ryantrahan">Ryan Trahan</option>
          <option value="airrack">Airrack</option>
          <option value="airrack">MrTrack</option>
        </select>
        <button type="submit" className='mainButton'>
            {loading ? <i class="fa fa-circle-o-notch fa-spin" /> : <i class="	fa fa-angle-right" />}
        </button>
      </form>
      <div className='creatorContainer'>
        <div className='titlesContainer'>
          <button className='refreshButton' onClick={() => {setLoadingRefresh(true); getData();}}>
            {loadingRefresh ? <i class="fa fa-circle-o-notch fa-spin" /> : <i class="fa fa-refresh" />}
          </button>
          <p>{error ? error : titles}</p>
        </div>
      </div>
    </>
  );
}

export default CreatorTitles;