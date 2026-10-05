import { DealTrackerSheet } from "./DealTrackerSheet";
import { MyPostsSheet } from "./MyPostsSheet";
import { PitchDialog } from "./PitchDialog";
import { PostOpportunityDialog } from "./PostOpportunityDialog";
import { PreferencesDialog } from "./PreferencesDialog";

export function OpportunityDialogs() {
  return (
    <>
      <PreferencesDialog />
      <PitchDialog />
      <PostOpportunityDialog />
      <DealTrackerSheet />
      <MyPostsSheet />
    </>
  );
}
